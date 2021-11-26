import {Component} from 'react';
import './texteditor.scss';
const ReactQuill = require('react-quill');
class TextEditor extends Component {

    handleChange(value: string) {
        console.log(this.props);
         //@ts-ignore
    //   this.props.handleTextChange(value);
    }
   
    render() {
        const modules = {
            toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                ['link', 'image'],
                ['clean'],
            ],
        };
            
        const formats = [
            'header',
            'bold',
            'italic',
            'underline',
            'strike',
            'blockquote',
            'list',
            'bullet',
            'indent',
            'link',
            'image',
        ];
            
      return (
        <ReactQuill 
             //@ts-ignore
            value={this.props.text}
            onChange={this.handleChange} 
            formats={formats}
            modules={modules}

        />
      )
    }
  }
  export default TextEditor;