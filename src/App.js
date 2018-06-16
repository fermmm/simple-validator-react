import React, { Component } from 'react';
import NativeInputWrapper from './Components/InputWrapper/NativeInputWrapper';
import { Validation } from 'simple-validator-js';
import MuiTextFieldWrapper from './Components/InputWrapper/MuiTextFieldWrapper';



class App extends Component {
    validators = {
        testValidator: (t) =>
            new Validation(t)
                .noNumbersAllowed(false)    // Autocorrect disabled for this rule
                .wordsShouldStartWithUpperCase(true)
    };

    state = {
        value: "",
        value2: "",
        value3: "",
        value4: "",
        value5: "",
    }

    render() {
        return (
            <div>
                No numbers are allowed and the text should start with uppercase (autocorrected).
                <br />
                <br />
                
                This shows error while tiping:
                <NativeInputWrapper
                    showValidationErrorWhileTyping
                    validator={this.validators.testValidator}
                    value={this.state.value2}
                    onChange={e => this.setState({ value2: e.target.value })}
                >
                </NativeInputWrapper>
                <br />
                
                This shows error on mount:
                <NativeInputWrapper
                    showValidationErrorWhileTyping
                    showValidationErrorOnRender
                    validator={this.validators.testValidator}
                    value={this.state.value3}
                    onChange={e => this.setState({ value3: e.target.value })}
                >
                </NativeInputWrapper>
                <br />

                This shows error on blur only:
                <NativeInputWrapper
                    validator={this.validators.testValidator}
                    value={this.state.value}
                    onChange={e => this.setState({ value: e.target.value })}
                >
                </NativeInputWrapper>
                <br />

                Underline disabled (underline has some known scrolling bugs):
                <NativeInputWrapper
                    disableUnderline
                    showValidationErrorWhileTyping
                    validator={this.validators.testValidator}
                    value={this.state.value4}
                    onChange={e => this.setState({ value4: e.target.value })}
                >
                </NativeInputWrapper>

                <br />
                Apply to an imput from a UI library:
                <br />
                <br />
                <MuiTextFieldWrapper
                    showValidationErrorWhileTyping
                    validator={this.validators.testValidator}
                    value={this.state.value5}
                    onChange={e => this.setState({ value5: e.target.value })}
                />
            </div>
        );
    }
}

export default App;
