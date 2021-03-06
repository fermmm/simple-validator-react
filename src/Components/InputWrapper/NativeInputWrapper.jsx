import React, { Component } from 'react';
import ValidationHandler from './ValidationHandler/ValidationHandler'
import UnderlineOverlay from './UnderlineOverlay/UnderlineOverlay'
import PropTypes from 'prop-types';

class NativeInputWrapper extends Component {
    static propTypes = {
        validator: PropTypes.func,
        showValidationErrorWhileTyping: PropTypes.bool,
        showValidationErrorOnRender: PropTypes.bool,
        disableUnderline: PropTypes.bool
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
        this.propsToFroward = {...this.props};
        delete this.propsToFroward.validator;
        delete this.propsToFroward.showValidationErrorWhileTyping;
        delete this.propsToFroward.showValidationErrorOnRender;
        delete this.propsToFroward.onChange;
        delete this.propsToFroward.onBlur;
        delete this.propsToFroward.onFocus;
        delete this.propsToFroward.disableUnderline;
    }

    onChange(e) {
        e.target.value = this.validationHandler.getAutocorrectedText(e.target.value);
        if(this.props.onChange != null)
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
        if(this.props.onFocus != null)
            this.props.onFocus(e);
    }

    onBlur(e) {
        this.setState({ focused: false });
        if(this.props.onBlur != null)
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

        return (
            <div style={{position:"relative"}}>
                <input {...this.propsToFroward} onChange={this.onChange} onBlur={this.onBlur} onFocus={this.onFocus} ref={this.inputRef} spellCheck={false}/>
                {(this.inputRef.current && !this.props.disableUnderline) &&
                    <UnderlineOverlay
                        offsetLeft={1}
                        offsetTop={11}
                        inputRef={this.inputRef}
                        inputValue={this.props.value}
                        charactersToUnderline={this.validationHandler.getErrorCharacters(this.state.focused)}
                    />
                }
                <div style={{color:"red"}} >
                    {this.validationHandler.getTextToRender(this.state.focused, "en")}
                </div>
            </div>
        );
    }
}

export default NativeInputWrapper;