import React from 'react';
import SVG from 'react-inlinesvg';

import IconManage from '../../../icons/template/manage.svg';
import IconProperties from '../../../icons/template/properties.svg';
import IconPatterns from '../../../icons/template/patterns.svg';
import IconBlocks from '../../../icons/template/blocks.svg';
import IconAdd from '../../../icons/template/add.svg';
import IconRemove from '../../../icons/template/remove.svg';
import IconMove from '../../../icons/template/move.svg';
import IconHTML from '../../../icons/template/html.svg';
import IconCSS from '../../../icons/template/css.svg';
 
const icons = {
    manage: IconManage,
    properties: IconProperties,
    patterns: IconPatterns,
    blocks: IconBlocks,
    add: IconAdd,
    remove: IconRemove,
    move: IconMove,
    html: IconHTML,
    css: IconCSS,
};

const Icon = (props) => {
    let icon = icons.hasOwnProperty(props.type) ? icons[props.type] : false;

    if ( !icon ) {
        return <span className="wprm-template-noicon">&nbsp;</span>;
    }

    return (
        <span className='wprm-template-icon'>
            <SVG
                src={icon}
            />
        </span>
    );
}
export default Icon;