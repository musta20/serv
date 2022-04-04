import Image from "next/image";
export default function  LoadImgeFile  ({ id }) {


    return <>{!id ? '' : <Image
      className="bd-placeholder-img card-img-top"
  
      src={`http://127.0.0.1:8000/api/showPublicImge/${id}`}
      width={150}
      height={200}
  
    ></Image>}</>;
  
  }