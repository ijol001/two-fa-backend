//Get user details 
async function loggedUser(req, res) {
    res.send({"user": req.user})
}
export default loggedUser; 
