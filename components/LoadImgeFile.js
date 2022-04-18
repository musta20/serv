import Image from "next/image";
export default function  LoadImgeFile  ({ id }) {


    return <>{!id ? '' : <Image
      className="bd-placeholder-img card-img-top"
  
      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/showPublicImge/${id}`}
      width={150}
      height={200}
  
    ></Image>}</>;
  
  }