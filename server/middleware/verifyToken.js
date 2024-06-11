import jwt from "jsonwebtoken";

export const verifyToken = (req,res,next) => {
  const token = req.cookies.token

  if(!token) return res.status(401).json({msg: "not auth!"});

  //will return either error or payload which has user information.
  jwt.verify(token, process.env.JWT_SECRET, async(err, payload) =>{
    if(err) return res.status(401).json({msg: "not auth!"});
    req.userId = payload.id; // we pass userId to shouldbeloggin

    next();

  })
}