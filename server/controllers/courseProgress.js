const CourseProgress = require("../models/CourseProgress");
// const SubSection = require("../models/SubSection");
// const SubSection=require("../models/SubSection");
const SubSection = require("../models/SubSection"); 



exports.updateCourseProgress = async(req,res) => {
    const {courseId, SubSectionId} = req.body;
    console.log("sksksks",SubSectionId)
    const userId = req.user.id;

    try{
        //check if the SubSection is valid
        const SubSection = await SubSection.findById(SubSectionId);

        console.log("SubSection Validation Done");
        if(!SubSection) {
            return res.status(404).json({error:"Invalid SubSection"});
        }


        //check for old entry 
        let courseProgress = await CourseProgress.findOne({
            courseID:courseId,
            userId:userId,
        });
        if(!courseProgress) {
            return res.status(404).json({
                success:false,
                message:"Course Progress does not exist"
            });
        }
        else {
            console.log("Course Progress Validation Done");
            //check for re-completing video/SubSection
            if(courseProgress.completedVideos.includes(SubSectionId)) {
                return res.status(400).json({
                    error:"SubSection already completed",
                });
            }

            //poush into completed video
            courseProgress.completedVideos.push(SubSectionId);
            console.log("Copurse Progress Push Done");
        }
        await courseProgress.save();
        console.log("Course Progress Save call Done");
        return res.status(200).json({
            success:true,
            message:"Course Progress Updated Successfully",
        })
    }
    catch(error) {
        console.error(error);
        return res.status(400).json({error:"Internal Server Error"});
    }
}