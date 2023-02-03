import { FC, useContext, useState } from "react";

import Image from "next/image";
import { authUserContext } from "@context/authUserContext";
import { User } from "types";

export const Profile: FC = () => {
  const user = useContext(authUserContext).user as User | null;

  const [open, setOpen] = useState(false);
  const [dataUser, setDataUser] = useState(user);

  return (
    <>
      <button
        className="fixed w-28 h-28 top-0 left-0 bg-red-900 "
        onClick={() => setOpen((state) => !state)}
      ></button>
      <section
        className={`${
          open ? "" : "translate-x-full"
        } fixed top-0 right-0 w-full max-w-xs h-screen bg-purple-900 flex flex-col justify-start items-center ease duration-700`}
      >
        <div
          className="flex flex-row justify-between items-center w-full"
          onClick={() => setOpen(false)}
        >
          <Image
            src={`https://banner2.cleanpng.com/20180320/hye/kisspng-computer-icons-online-chat-livechat-technical-supp-live-chat-symbol-icon-5ab090a31ac957.4211316915215208031097.jpg`}
            width={80}
            height={80}
            quality={30}
            alt="logo app"
          />
          <button className="flex justify-center items-center p-2 m-2 bg-red-600 rounded-md">
            X
          </button>
        </div>
        <div>
          <Image
            src={`${dataUser?.image || "https://avatars0.githubusercontent.com/u/33479836?v=4"}`}
            width={280}
            height={280}
            quality={30}
            alt="img avatar user"
            className="rounded-full border-4 mt-12"
          />
        </div>
        <hr className="bg-white w-full max-w-[90%] my-10" />
        {/* <section className="text-white text-lg flex flex-col justify-start items-start w-full px-6 gap-2"> */}
        {/*   {dataUser?.username && <p className="justify-start items-center truncate w-full">user Name : {dataUser.username}</p>} */}
        {/*   {dataUser?.name && <p className="justify-start items-center truncate w-full">Name : {dataUser.name}</p>} */}
        {/*   {dataUser?.phone && <p className="justify-start items-center truncate w-full">Phone : {dataUser.phone}</p>} */}
        {/*   {dataUser?.email && <p className="justify-start items-center truncate w-full">Email : {dataUser.email}</p>} */}
        {/*   {dataUser?.trabajo && <p className="justify-start items-center truncate w-full">Trabajo : {dataUser.trabajo}</p>} */}
        {/*   {dataUser?.skills && <p className="justify-start items-center truncate w-full">Skills : {dataUser.skills.join(", ")}</p>} */}
        {/*   {dataUser?.nacionalidad && <p className="justify-start items-center truncate w-full">Nacionalidad : {dataUser.nacionalidad}</p>} */}
        {/* </section> */}
      </section>
    </>
  );
};
