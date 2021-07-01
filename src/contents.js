function fillLinks(){
    let temp = [];
    for(let i = 0; i < 9; i++){
        temp.push(null);
    }
    return temp;
}

class Content{

    constructor(){
        this.content = '';
        this.title = '';
        this.links = [fillLinks()];
        
    }

    setTitle(newTitle){
        this.title = newTitle;
    }

    insertDirectionLink(link, direction){
        if(direction < 0 || direction > 8){
            console.log('invalid insertion');
        }
        this.links[direction] = link;
    }

    insert(link){
        this.links.push(link);
    }
    
}