import React, { Component } from 'react';
import InputWrapper from './Components/InputWrapper/InputWrapper';
import { Validation } from 'simple-validator-js';

class App extends Component {
    validators = {
        email: (t) =>
            new Validation(t)
                .noNumbersAllowed(false)    // Autocorrect disabled for this rule
                .wordsShouldStartWithUpperCase(true)
    };

    state = { 
        value:"",
        value2:"",
        value3:"" 
    }

    render() {
        return (
            <div>
                No numbers are allowed and the text should start with uppercase.
                <br/>
                <br/>
                This shows error while tiping:
                <InputWrapper
                    validator={this.validators.email}
                    showValidationErrorWhileTyping={true}
                    showValidationErrorOnMount={false}
                    value={this.state.value2}
                    onChange={e => this.setState({ value2: e.target.value })}
                >
                </InputWrapper>
                <br/>
                This also shows error on mount:
                <InputWrapper
                    validator={this.validators.email}
                    showValidationErrorWhileTyping={true}
                    showValidationErrorOnMount={true}
                    value={this.state.value3}
                    onChange={e => this.setState({ value3: e.target.value })}
                >
                </InputWrapper>
                <br/>
                This shows error on blur:
                <InputWrapper
                    validator={this.validators.email}
                    showValidationErrorWhileTyping={false}
                    showValidationErrorOnMount={false}
                    value={this.state.value}
                    onChange={e => this.setState({ value: e.target.value })}
                >
                </InputWrapper>
            </div>
        );
    }
}

export default App;
