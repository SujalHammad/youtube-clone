class ApiError extends Error{
    constructor(statusCode,message="Something went wrong",errors=[],stack=""){
        super(message)
        this.successs=false
        this.data=null
        this.message=message
        this.errors=errors
        this.statusCode=statusCode

        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.contructor)
        }
    }
}

module.exports={ApiError}