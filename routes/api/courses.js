const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Course = require('../../models/Course');


router.post('/createCourse', (req, res) => {
    let {
        company,
        group,
        name,
        description,
    } = req.body;

    Course.findOne({
        name: name,
        company:company
    }).then(course => {
        if (course) {
            return res.status(400).json({
                msg: "This course already exists in the list."
            });
        } else {
            // Create and save the new course
            const newCourse = new Course({
                company,
                group,
                name,
                description,
            });

            newCourse.save()
                .then(savedCourse => {
                    return res.status(201).json({
                        msg: "Course created successfully.",
                        course: savedCourse
                    });
                })
                .catch(error => {
                    return res.status(500).json({
                        msg: "Error creating the course.",
                        error: error
                    });
                });
        }
    });
});

// '/deleteCourse/:id'  
router.delete('/deleteCourse/:id', (req, res) => {
    Course.findByIdAndDelete(req.params.id)
        .then(deletedCourse => {
            if (!deletedCourse) {
                return res.status(404).json({
                    msg: 'Course not found',
                });
            }
            return res.status(200).json({
                msg: 'Course deleted successfully',
                course: deletedCourse,
            });
        })
        .catch(error => {
            return res.status(500).json({
                msg: 'Error deleting the course',
                error: error,
            });
        });
});

router.get('/getCourses', (req, res) => {
    Course.find()
        .then(courses => {
            return res.status(200).json({
                msg: 'Courses retrieved successfully',
                courses: courses,
            });
        })
        .catch(error => {
            return res.status(500).json({
                msg: 'Error retrieving courses',
                error: error,
            });
        });
});

router.put('/updateCourse/:id', (req, res) => {
    const courseId = req.params.id;
    const {
        company,
        group,
        name,
        description,
    } = req.body;

    Course.findByIdAndUpdate(courseId, {
        company,
        group,
        name,
        description,
    }, { new: true }) 
        .then(updatedCourse => {
            if (!updatedCourse) {
                return res.status(404).json({
                    msg: 'Course not found',
                });
            }
            return res.status(200).json({
                msg: 'Course updated successfully',
                course: updatedCourse,
            });
        })
        .catch(error => {
            return res.status(500).json({
                msg: 'Error updating the course',
                error: error,
            });
        });
});




module.exports = router;
