import { ButtonComponent } from "./ButtonComponet";
import { useState } from "react";
 export const InputStreamComponent = ()=>{
  console.log("you are trying to get the Section Component ");
    const [contextgiver , setContextGiver] = useState('');
    return <>
                <ButtonComponent setContextGiver ={setContextGiver} contextgiver={contextgiver}
                >
                </ButtonComponent>
            </>
 }