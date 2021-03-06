import React, { Component } from 'react';
import ValidationHandler from './ValidationHandler/ValidationHandler'
import UnderlineOverlay from './UnderlineOverlay/UnderlineOverlay'
import PropTypes from 'prop-types';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

class MuiTextFieldWrapper extends Component {
    static propTypes = {
        validator: PropTypes.func,
        showValidationErrorWhileTyping: PropTypes.bool,
        showValidationErrorOnRender: PropTypes.bool,
        disableUnderline: PropTypes.bool,
        label: PropTypes.string
    };

    state = {
        focused: false
    }

    validationHandler
    inputRef
    propsToFroward

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);

        this.inputRef = React.createRef();
        this.validationHandler = new ValidationHandler(props.validator, props.value);
    }

    frowardProps() {
        this.propsToFroward = { ...this.props };
        delete this.propsToFroward.validator;
        delete this.propsToFroward.showValidationErrorWhileTyping;
        delete this.propsToFroward.showValidationErrorOnRender;
        delete this.propsToFroward.onChange;
        delete this.propsToFroward.onBlur;
        delete this.propsToFroward.onFocus;
        delete this.propsToFroward.disableUnderline;
        delete this.propsToFroward.label;
    }

    onChange(e) {
        e.target.value = this.validationHandler.getAutocorrectedText(e.target.value);
        if (this.props.onChange != null)
            this.props.onChange(e);
    }

    componentDidUpdate(prevProps) {
        if(prevProps.value !== this.props.value)
        {
            if(!this.validationHandler.userTyped)
            {
                this.validationHandler.userTyped = true;
                this.validationHandler.getAutocorrectedText(this.props.value);
                this.forceUpdate();
            }
        }
    }

    onFocus(e) {
        this.setState({ focused: true });
        if (this.props.onFocus != null)
            this.props.onFocus(e);
    }

    onBlur(e) {
        this.setState({ focused: false });
        if (this.props.onBlur != null)
            this.props.onBlur(e);
    }

    render() {
        this.frowardProps();

        const {
            showValidationErrorWhileTyping,
            showValidationErrorOnRender
        } = this.props;

        this.validationHandler.showErrorOnRender = showValidationErrorOnRender;
        this.validationHandler.showErrorWhileTyping = showValidationErrorWhileTyping;
        const validationErrorText = this.validationHandler.getTextToRender(this.state.focused, 'en');

        return (
            <div style={{ position: 'relative', display: 'inline-block'}}>
                <FormControl error={validationErrorText != null}>
                    <InputLabel>{this.props.label}</InputLabel>
                    <Input {...this.propsToFroward} onChange={this.onChange} onBlur={this.onBlur} onFocus={this.onFocus} inputRef={(r) => this.inputRef = r} spellCheck={false} />
                    <FormHelperText>{validationErrorText}</FormHelperText>
                </FormControl>
                {(this.inputRef && !this.props.disableUnderline) &&
                    <UnderlineOverlay
                        offsetLeft={0}
                        offsetTop={58}
                        inputRef={this.inputRef}
                        inputValue={this.props.value}
                        charactersToUnderline={this.validationHandler.getErrorCharacters(this.state.focused)}
                    />
                }
            </div>
        );
    }
}

export default MuiTextFieldWrapper;