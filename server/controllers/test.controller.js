import jwt from "jsonwebtoken";

export const shouldBeLoggedIn = async (req,res) => {
  console.log(req.userId);
  res.status(200).json({msg: "You are authed!"});

}

export const shouldBeAdmin = async (req,res) => {
  const token = req.cookies.token

  if(!token) return res.status(401).json({msg: "not auth!"});

  //will return either error or payload which has user information.
  jwt.verify(token, process.env.JWT_SECRET, async(err, payload) =>{
    if (err) return res.status(403).json({msg: "not auth!"});

    if(!payload.isAdmin) {
      return res.status(403).json({msg: "not auth!"});
    }

  })
  res.status(200).json({msg: "You are authed!"});


}