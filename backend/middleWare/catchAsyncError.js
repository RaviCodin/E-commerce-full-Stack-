module.exports =( theFunc ) => (req,resp,next)=>{
    Promise.resolve(theFunc(req,resp,next)).catch(next);
    // console.log("done2");
}