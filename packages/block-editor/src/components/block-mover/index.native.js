/**
 * External dependencies
 */
import { first, last, partial, castArray } from 'lodash';

/**
 * WordPress dependencies
 */
import { ToolbarButton } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { withSelect, withDispatch } from '@wordpress/data';
import { withInstanceId, compose } from '@wordpress/compose';
import { arrowUp, arrowDown, arrowLeft, arrowRight } from '@wordpress/icons';

const BlockMover = ( {
	isFirst,
	isLast,
	isLocked,
	onMoveDown,
	onMoveUp,
	firstIndex,
	rootClientId,
	horizontalDirection,
} ) => {
	const firstButtonIcon = horizontalDirection ? arrowLeft : arrowUp;
	const secondButtonIcon = horizontalDirection ? arrowRight : arrowDown;

	const firstButtonDirection = horizontalDirection ? 'left' : 'up';
	const secondButtonDirection = horizontalDirection ? 'right' : 'down';

	const firstButtonHint = horizontalDirection
		? __( 'Double tap to move the block left' )
		: __( 'Double tap to move the block up' );
	const secondButtonHint = horizontalDirection
		? __( 'Double tap to move the block right' )
		: __( 'Double tap to move the block down' );

	const firstBlockMove = horizontalDirection
		? __( 'Move block left' )
		: __( 'Move block up' );
	const lastBlockMove = horizontalDirection
		? __( 'Move block right' )
		: __( 'Move block down' );

	const location = horizontalDirection ? 'position' : 'row';

	if ( isLocked || ( isFirst && isLast && ! rootClientId ) ) {
		return null;
	}

	return (
		<>
			<ToolbarButton
				title={
					! isFirst
						? sprintf(
								/* translators: accessibility text. %1: location - row or position (string) %2: current block position (number). %3: next block position (number) */
								__(
									'Move block %1$s from %2$s %3$s to %2$s %4$s'
								),
								firstButtonDirection,
								location,
								firstIndex + 1,
								firstIndex
						  )
						: firstBlockMove
				}
				isDisabled={ isFirst }
				onClick={ onMoveUp }
				icon={ firstButtonIcon }
				extraProps={ { hint: firstButtonHint } }
			/>

			<ToolbarButton
				title={
					! isLast
						? sprintf(
								/* translators: accessibility text. %1: location - row or position (string) %2: current block position (number). %3: next block position (number) */
								__(
									'Move block %1$s from %2$s %3$s to %2$s %4$s'
								),
								secondButtonDirection,
								location,
								firstIndex + 1,
								firstIndex + 2
						  )
						: lastBlockMove
				}
				isDisabled={ isLast }
				onClick={ onMoveDown }
				icon={ secondButtonIcon }
				extraProps={ {
					hint: secondButtonHint,
				} }
			/>
		</>
	);
};

export default compose(
	withSelect( ( select, { clientIds } ) => {
		const {
			getBlockIndex,
			getTemplateLock,
			getBlockRootClientId,
			getBlockOrder,
		} = select( 'core/block-editor' );
		const normalizedClientIds = castArray( clientIds );
		const firstClientId = first( normalizedClientIds );
		const rootClientId = getBlockRootClientId( firstClientId );
		const blockOrder = getBlockOrder( rootClientId );
		const firstIndex = getBlockIndex( firstClientId, rootClientId );
		const lastIndex = getBlockIndex(
			last( normalizedClientIds ),
			rootClientId
		);

		return {
			firstIndex,
			isFirst: firstIndex === 0,
			isLast: lastIndex === blockOrder.length - 1,
			isLocked: getTemplateLock( rootClientId ) === 'all',
			rootClientId,
		};
	} ),
	withDispatch( ( dispatch, { clientIds, rootClientId } ) => {
		const { moveBlocksDown, moveBlocksUp } = dispatch(
			'core/block-editor'
		);
		return {
			onMoveDown: partial( moveBlocksDown, clientIds, rootClientId ),
			onMoveUp: partial( moveBlocksUp, clientIds, rootClientId ),
		};
	} ),
	withInstanceId
)( BlockMover );
