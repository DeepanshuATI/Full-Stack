const createProblem=(req,res)=>{
    const {title,description,difficulty,tags,visibletestCases,invisibletestCases,startcode,problemCreatoe,referenceSolution}=req.body;
    
    try {
        for(const {language, initialcode} of referenceSolution){
            

        }
        
    } catch (error) {
        res.status(500).json({ message: "Error creating problem"+ error });
    }
}