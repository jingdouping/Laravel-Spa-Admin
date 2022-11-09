import './bootstrap';
import React from 'react'
import ReactDOM from "react-dom/client"

function App(){
  return (
    <div>
        
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
    <React.StrictMode>
        {/* <Provider store={store}> */}
            <App />
        {/* </Provider> */}
    </React.StrictMode>
);
