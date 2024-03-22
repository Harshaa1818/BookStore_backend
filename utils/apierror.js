class apierror{
    constructor(statuscode, data, message="failed"){
        (this.statuscode=statuscode), //(this.data=data);
        (this.message=message),(this.success= statuscode == 200);
    }
}



export {apierror};