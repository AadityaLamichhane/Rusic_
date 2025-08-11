import { RedirectingButton } from "../components/RedirectingButton"
export default function page (){
    // This will call and action to bring the ws connection and then redirect the user to the page with the sockket as the params to the Component or things like that 
    return <>
    <div className=" flex flex-col justify-center items-center h-screen w-screen">
        <div className="flex justify-center items-center ">
            <RedirectingButton>
                Hello 
            </RedirectingButton>
        </div>
    </div>

    </>
}

