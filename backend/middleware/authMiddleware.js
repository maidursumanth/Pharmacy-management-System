import jwt from "jsonwebtoken"

export const protect=async(req,res,next)=>{
    try {
        const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token, access denied" });
    }

    const actualToken=token.startsWith("Bearer ")
      ? token.split(" ")[1]
      : token;

    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

    req.user = decoded; 
    next();



    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}