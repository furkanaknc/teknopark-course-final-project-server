const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Course = require('../../models/Course');


router.post('/createCourse', async (req, res) => {
    try {
        const {
            company,
            group,
            name,
            description,
            educator,
        } = req.body;

        const existingCourse = await Course.findOne({
            name,
            company,
        });

        if (existingCourse) {
            return res.status(400).json({
                msg: "This course already exists in the list.",
            });
        }

        const newCourse = new Course({
            company,
            group,
            name,
            description,
            educator,
        });

        const savedCourse = await newCourse.save();

        return res.status(201).json({
            msg: "Course created successfully.",
            course: savedCourse,
        });
    } catch (error) {
        console.error('Error creating the course:', error);
        return res.status(500).json({
            msg: "Error creating the course.",
            error: error.message,
        });
    }
});


// '/deleteCourse/:id'  
router.delete('/deleteCourse/:id', async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);

        if (!deletedCourse) {
            return res.status(404).json({
                msg: 'Course not found',
            });
        }

        return res.status(200).json({
            msg: 'Course deleted successfully',
            course: deletedCourse,
        });
    } catch (error) {
        console.error('Error deleting the course:', error);
        return res.status(500).json({
            msg: 'Error deleting the course',
            error: error.message,
        });
    }
});


router.get('/getCourses', async (req, res) => {
    try {
        const courses = await Course.find();

        return res.status(200).json({
            msg: 'Courses retrieved successfully',
            courses: courses,
        });
    } catch (error) {
        console.error('Error retrieving courses:', error);
        return res.status(500).json({
            msg: 'Error retrieving courses',
            error: error.message,
        });
    }
});


router.put('/updateCourse/:id', async (req, res) => {
    try {
        const courseId = req.params.id;
        const {
            company,
            group,
            name,
            description,
            educator
        } = req.body;

        const updatedCourse = await Course.findByIdAndUpdate(courseId, {
            company,
            group,
            name,
            description,
            educator
        }, { new: true });

        if (!updatedCourse) {
            return res.status(404).json({
                msg: 'Course not found',
            });
        }

        return res.status(200).json({
            msg: 'Course updated successfully',
            course: updatedCourse,
        });
    } catch (error) {
        console.error('Error updating the course:', error);
        return res.status(500).json({
            msg: 'Error updating the course',
            error: error.message,
        });
    }
});





module.exports = router;
