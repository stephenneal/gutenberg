/**
 * WordPress dependencies
 */
import { useRef, useEffect, createPortal, Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import useSlot from './use-slot';

export default function Fill( { name, children } ) {
	const slot = useSlot( name );
	const ref = useRef();

	useEffect( () => {
		slot.registerFill( ref );
		return () => {
			slot.unregisterFill( ref );
		};
	}, [ slot.registerFill, slot.unregisterFill ] );

	if ( ! slot.ref || ! slot.ref.current ) {
		return null;
	}

	if ( typeof children === 'function' ) {
		children = children( slot.fillProps );
	}

	const { length } = Object.keys( slot.fills );

	return createPortal(
		<Fragment key={ length }>{ children }</Fragment>,
		slot.ref.current
	);
}
