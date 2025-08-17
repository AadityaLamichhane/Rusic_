
export type SectionPageProps = {
    params: Promise<{
        id:string
    }>;
}
export type ExportType = {
    isOwner:boolean  ,
    isError?:boolean,
    AnyError? :String,
    createdBy?:String
    isSection:boolean
}