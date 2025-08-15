const userHandling =(id:string)=>{
    console.log(id);
    class User {
        name :string;
        id :string ;
        constructor (name:string , id:string){
            this.id = id ;
            this.name = name;
        }
    }
    const users : User[] = [];
    const user1  =new User('Aaditya lamichhane',id);
    // On adding the new user in the db there should be the new user object as weell 
    const user2 = new User("Mero naam","id2");
    // Push the user to the group 
    users.push(user2);
    let streamId :number = 0 ; 
    const sectionMap = new Map<string,User[]>();
    sectionMap.set(id,users);

}
