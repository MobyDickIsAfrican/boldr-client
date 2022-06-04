import logo from './logo.svg';
import './App.css';
import {MdEmail} from 'react-icons/md';
import {useState, useRef} from 'react';
import {SUBSCRIBE_ENDPOINT} from './constants.js';

function App() {
  const [control, setControl] = useState("");
  const [error, setError] = useState(null); //string message
  const [success, setSuccess] = useState(false); //boolean
  const ref = useRef(null)

  const handleChange = (e) => {
    let value = e.target.value;
    setControl(value);
  };
  const subscribe = (e) => {
    if(control){
      const asyncPost = async () => {
        toggle()
        let response  = await fetch(SUBSCRIBE_ENDPOINT, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({email: control}),
          mode: 'cors',
        });

        response = await response.json();

        if(response["statusCode"] === 201){
          setSuccess(true);
          setError(null);
        } else if(response["statusCode"] === 400 || response["statusCode"] === 406 || response["statusCode"] === 500){
          setError(response["body"]);
        };

        //remove loading spinner after response is processed
        toggle()
      };

      asyncPost()
    }
  };

  const toggle = () => {
    let htmlEle = ref.current;
    if(htmlEle.classList.contains("hide")){
      htmlEle.classList.remove("hide");
      htmlEle.classList.add("show");
    } else{
      console.log(htmlEle.classList.contains("show"))
      htmlEle.classList.remove("show");
      htmlEle.classList.add("hide");
    };

  }

  return (
    <div className="App container-fluid d-flex flex-row align-items-center justify-content-center">
      <div className='col-md-6 subscribe-box px-5 pb-5
      d-flex flex-column align-items-center'>
        <div className="spinner-container d-flex flex-row align-items-center justify-content-center
        hide" 
        ref={ref}>
        <div className="spinner-border pb-0" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        </div>
        <div className='email-icon-container px-2 pt-2 pb-2 mb-0'>
          <div className='email-icon-wrapper px-2 pt-2 pb-2'>
            <MdEmail className='email-icon'/>
          </div>
        </div>
        <div className='row header mb-3 '>
          <h1 className='mt-0 pt-0'>Newsletter</h1>
          <span>Stay up to date with our latest news and products.</span>
        </div>
        {success? <div className='row d-flex flex-row justify-content-center mb-3'>
          <h3 className='success'>You have successfully subscribed</h3>
        </div>: 
        <div className='row d-flex flex-row justify-content-center mb-3'>
          <input type="email" className="form-control form-control-lg me-3 mb-sm-2" 
          id="exampleFormControlInput1" 
          placeholder="your email address" value={control} onChange={handleChange} />
          <span className='error-msg small mb-2'>{error}</span>
          <button type="button" className="btn btn-primary" onClick={subscribe}>Subscribe</button>
        </div>}
        <span className='error-msg large mb-2'>{error}</span>
        <div className='row footer'>
          <span>Your email is safe with us, we don't spam</span>
        </div>
      </div>
    </div>
  );
}

export default App;
