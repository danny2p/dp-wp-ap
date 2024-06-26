import React from 'react';

import '../../../css/admin/template/main.scss';

import ManageTemplates from './manage-templates';
import EditTemplate from './edit-template';
import PreviewTemplate from './preview-template';
import ShortcodeGenerator from './shortcode-generator';

const Main = (props) => {
    return (
        <div id="wprm-template-main" className={`wprm-template-main-${props.mode}`}>
            {
                'manage' === props.mode
                &&
                <ManageTemplates
                    templates={ props.templates }
                    template={ props.template }
                    onChangeEditing={ props.onChangeEditing }
                    onDeleteTemplate={ props.onDeleteTemplate }
                    onChangeTemplate={ props.onChangeTemplate }
                    savingTemplate={ props.savingTemplate }
                    onSaveTemplate={ props.onSaveTemplate }
                />
            }
            {
                'manage' !== props.mode && props.template
                &&
                <EditTemplate
                    mode={ props.mode }
                    template={ props.template }
                    onChangeHTML={ props.onChangeHTML }
                    onChangeCSS={ props.onChangeCSS }
                />
            }
            {
                'shortcode' === props.mode
                &&
                <ShortcodeGenerator
                    shortcode={ props.shortcode }
                    onChangeShortcode={ props.onChangeShortcode }
                />
            }
            {
                props.template
                &&
                <PreviewTemplate
                    mode={ props.mode }
                    template={ props.template }
                    onChangeHTML={ props.onChangeHTML }
                    onChangeCSS={ props.onChangeCSS }
                    onChangeMode={ props.onChangeMode }
                />
            }
        </div>
    );
}

export default Main;