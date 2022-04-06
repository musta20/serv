import { useState } from "react";

const Model = ({ id, DeleteServ , msg ,ModelId }) => {
  const [isLoading , setloadin]  = useState(false)
    return <div className="modal fade"
     id={ModelId}
     data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" 
     aria-labelledby="staticBackdropLiveLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLiveLabel">عنوان الصندوق العائم</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="إغلاق"></button>
          </div>
          <div className="modal-body">
            {msg}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary"
              data-bs-dismiss="modal">إغلاق</button>
  
            <button onClick={(event) => DeleteServ(id,event,setloadin)}
             // data-bs-dismiss="modal"
              
              type="button"
              className="btn  btn-outline-success">
                {isLoading ?
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  : "  إنهاء الطلب"   }

              </button>
          </div>
        </div>
      </div>
    </div>
  }

  export default Model;