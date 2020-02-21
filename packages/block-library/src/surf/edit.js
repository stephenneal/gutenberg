/**
 * WordPress dependencies
 */
import { RangeControl, PanelBody } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const SurfEdit = ( {
	attributes,
	setAttributes,
} ) => {
	const { waveHeight } = attributes;

	const changeWaveHeight = ( height ) => {
		setAttributes( { waveHeight: height } );
	};

	return (
		<>
			<div>🌊 Wave height: {waveHeight} ft</div>
			<InspectorControls>
				<PanelBody title={ __( 'Surf settings' ) }>
					<RangeControl
						label={ __( 'Wave height in feet' ) }
						minimumValue={ 0 }
						maximumValue={ 20 }
						separatorType={ 'none' }
						value={ waveHeight }
						onChange={ changeWaveHeight }
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
};

export default SurfEdit;
