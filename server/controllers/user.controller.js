import prisma from "../lib/prisma.js"
import bcrypt from "bcrypt";


export const getUsers = async (req,res) => {
  
  try{
    const users = await prisma.user.findMany();
    res.status(200).json(users);

  }catch(err){
    console.log(err)
    res.status(500).json({msg: "failed to get Users"})
  }
}

export const getUser = async (req,res) => {
  const id = req.params.id;
  console.log(id);
  
  try{
    const user = await prisma.user.findUnique({
      where:{id},
    })
    res.status(200).json(user);

  }catch(err){
    console.log(err)
    res.status(500).json({msg: "failed to get User"})
  }
}

export const updateUser = async (req,res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const {password,avatar, ...inputs} = req.body;

  if(id !== tokenUserId){
    res.status(403).json({msg: "돌아가!"})
  }

  let updatedPassword = null;
  try{

    if(password){
      updatedPassword = await bcrypt.hash(password,10);
    }

    
    const updatedUser = await prisma.user.update({
      where:{id},
      data: {
        ...inputs,
        ...(updatedPassword && {password: updatedPassword}), //updatedPassword 값이 있을 때만 패스워드를 업데이트
        ...(avatar && {avatar}),
      }
    })
    const {password:userPassword, ...rest} = updatedUser
    res.status(200).json(rest);

  }catch(err){
    console.log(err)
    res.status(500).json({msg: "failed to update user"})
  }
}

export const deleteUser = async (req,res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  if(id !== tokenUserId){
    res.status(403).json({msg: "돌아가2!"})
  }


  try{
    await prisma.user.delete({
      where:{id}
    })
  res.status(200).json({msg: "deleted a user"})

  }catch(err){
    console.log(err)
    res.status(500).json({msg: "failed to delete user"})
  }
}

export const savePost = async (req,res) => {
  const postId = req.body.postId
  const tokenUserId = req.userId

  try{
    const savedPost = await prisma.savedPost.findUnique({
      where:{
        userId_postId: {
          userId: tokenUserId,
          postId,
        }

      }
    })
  if(savedPost){
    await prisma.savedPost.delete({
      where:{
        id:savedPost.id,
      }
    })
    res.status(200).json({msg: "Post removed from saved list"});
  } else{
    await prisma.savedPost.create({
      data:{
        userId: tokenUserId,
        postId,
      }
    })
    res.status(200).json({msg: "Post saved in the list"});

  }

  }catch(err){
    console.log(err)
    res.status(500).json({msg: "failed to save a post"})
  }
}


export const profilePosts = async (req,res) => {
  
  const tokenUserId = req.userId;
 
  try{
    //내가 등록한 my list 정보들 불러오기
    const userPosts = await prisma.post.findMany({
      
      where:{userId: tokenUserId},
    })
    //내가 저장한 list 정보들 불러오기
    const saved = await prisma.savedPost.findMany({
      where:{userId: tokenUserId},
      include: {
        post: true, // post 정보도 같이 가지고 오기.
      }
    })
    
    //as we only need include part, we need to map
    const savedPosts = saved.map(item => item.post)
    res.status(200).json({userPosts,savedPosts});



  }catch(err){
    console.log(err)
    res.status(500).json({msg: "failed to get profilePosts"})
  }
}