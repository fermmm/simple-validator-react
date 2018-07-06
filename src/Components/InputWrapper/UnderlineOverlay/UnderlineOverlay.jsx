import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Renders a div on top of the input, with the color of the text as transparent but not the underline, so a underline
 * is rendered on top of the input used for validation. This hack is needed since inputs cannot render html text.
 */
export default class UnderlineOverlay extends Component {
    static propTypes = {
        inputRef: PropTypes.object,
        inputValue: PropTypes.string,
        charactersToUnderline: PropTypes.arrayOf(PropTypes.number),
        offsetTop: PropTypes.number,
        offsetLeft: PropTypes.number
    };

    divRef;

    constructor(props) {
        super(props);
        this.divRef = React.createRef();
    }

    componentDidUpdate() {
        this.syncScroll();
    }

    syncScroll() {
        if (this.divRef.current == null) {
            return;
        }
        this.divRef.current.scrollTop = this.props.inputRef.scrollTop;
    }

    render() {
        const { inputRef, inputValue, charactersToUnderline } = this.props;
        let input = inputRef;

        if(input.current)
            input = input.current;

        if (input == null) {
            return null;
        }
        
        if (charactersToUnderline == null) {
            return null;
        }
        
        if (charactersToUnderline.length === 0) {
            return null;
        }
        
        input.onscroll = () => this.syncScroll();

        // Apply the styles of the input text to the olverlay div to make it look the same.
        const inputStyles = window.getComputedStyle(input);
        const divStyle = {
            position: 'absolute',
            color: 'rgba(0, 0, 0, 0)',
            pointerEvents: 'none',
            overflow: 'hidden',

            top: '0',
            fontSize: inputStyles.fontSize,
            right: inputStyles.right,
            left: inputStyles.left,
            width: inputStyles.width,
            //height: inputStyles.height,
            overfontSize: inputStyles.fontSize,
            fontFamily: inputStyles.fontFamily,
            lineHeight: inputStyles.lineHeight,
            wordWrap: inputStyles.wordWrap,
            padding: inputStyles.padding,
            margin: inputStyles.margin,
            textAlign: inputStyles.textAlign,
            textIndent: inputStyles.textIndent,
            textTransform: inputStyles.textTransform,
            whiteSpace: inputStyles.whiteSpace,
            letterSpacing: inputStyles.letterSpacing,
            wordSpacing: inputStyles.wordSpacing,
            transform: `translate(${this.props.offsetLeft}%, ${this.props.offsetTop}%)`
        };

        // Draw underline on top of the input text:
        let closeTag = false;
        let underlineCharacter = false;
        let textToShow = '';

        for (let i = 0; i < inputValue.length; i++) {
            underlineCharacter = false;
            if (charactersToUnderline != null && charactersToUnderline.length > 0) {
                underlineCharacter = charactersToUnderline.indexOf(i) !== -1;
            }
            if (underlineCharacter && !closeTag) {
                closeTag = true;
                textToShow += '<span style="border-bottom: 2px solid red">';
            } else if (!underlineCharacter && closeTag) {
                closeTag = false;
                textToShow += '</span>';
            }
            textToShow += inputValue[i];
        }

        return (<div style={divStyle} dangerouslySetInnerHTML={{ __html: textToShow }} ref={this.divRef}></div>);
    }
}