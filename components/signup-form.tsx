"use client"

import React, { useState } from "react"
import { auth, db } from "@/lib/firebase"
import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "firebase/auth"
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { FcGoogle } from "react-icons/fc"
import { ArrowLeft, ArrowRight, Check, User, Mail, Phone, GraduationCap, Calendar, BookOpen, Heart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SignupFormProps {
  onSuccess?: () => void
  onBack?: () => void
}

interface SignupData {
  // Step 1: Basic Info
  fullName: string
  displayName: string
  personalEmail: string
  phoneNumber: string
  
  // Step 2: Academic Info
  collegeEmail: string
  yearOfStudy: string
  fieldOfStudy: string
  
  // Step 3: Skills & Interests
  skills: string[]
  interests: string[]
  customSkill: string
  customInterest: string
}

const YEARS_OF_STUDY = [
  "1st Year",
  "2nd Year", 
  "3rd Year",
  "4th Year",
  "5th Year",
  "Post Graduate",
  "PhD",
  "Other"
]

const FIELDS_OF_STUDY = [
  "Computer Science & Engineering",
  "Electronics & Communication Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Chemical Engineering",
  "Aerospace Engineering",
  "Biotechnology",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "Business Administration",
  "Literature",
  "History",
  "Psychology",
  "Medicine",
  "Law",
  "Architecture",
  "Design",
  "Other"
]

const SKILLS_OPTIONS = [
  "Programming (Python)",
  "Programming (JavaScript)",
  "Programming (Java)",
  "Programming (C++)",
  "Web Development",
  "Mobile App Development",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Cloud Computing",
  "Cybersecurity",
  "UI/UX Design",
  "Graphic Design",
  "Digital Marketing",
  "Content Writing",
  "Photography",
  "Video Editing",
  "Music Production",
  "Public Speaking",
  "Leadership",
  "Project Management",
  "Research",
  "Analytical Thinking",
  "Problem Solving",
  "Communication",
  "Teamwork"
]

const INTERESTS_OPTIONS = [
  "Technology",
  "Gaming",
  "Sports",
  "Music",
  "Art & Design",
  "Photography",
  "Travel",
  "Food & Cooking",
  "Fitness & Health",
  "Reading",
  "Movies & TV Shows",
  "Fashion",
  "Environment & Sustainability",
  "Social Causes",
  "Entrepreneurship",
  "Finance & Investment",
  "Science & Research",
  "History",
  "Languages",
  "Dance",
  "Theater",
  "Volunteering",
  "Gaming",
  "Board Games",
  "Outdoor Activities",
  "Coding & Programming"
]

export function SignupForm({ onSuccess, onBack }: SignupFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showWelcome, setShowWelcome] = useState(false)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  
  const [formData, setFormData] = useState<SignupData>({
    fullName: "",
    displayName: "",
    personalEmail: "",
    phoneNumber: "",
    collegeEmail: "",
    yearOfStudy: "",
    fieldOfStudy: "",
    skills: [],
    interests: [],
    customSkill: "",
    customInterest: ""
  })

  const totalSteps = 3

  const updateFormData = (field: keyof SignupData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Check username availability when display name changes
    if (field === "displayName" && value.trim()) {
      checkUsernameAvailability(value.trim())
    }
  }

  const checkUsernameAvailability = async (username: string) => {
    if (!username.trim()) {
      setUsernameAvailable(null)
      return
    }

    setCheckingUsername(true)
    try {
      const q = query(
        collection(db, "users"),
        where("displayName", "==", username.trim())
      )
      const querySnapshot = await getDocs(q)
      setUsernameAvailable(querySnapshot.empty)
    } catch (error) {
      console.error("Error checking username:", error)
      setUsernameAvailable(null)
    } finally {
      setCheckingUsername(false)
    }
  }

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const addCustomSkill = () => {
    if (formData.customSkill.trim() && !formData.skills.includes(formData.customSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.customSkill.trim()],
        customSkill: ""
      }))
    }
  }

  const addCustomInterest = () => {
    if (formData.customInterest.trim() && !formData.interests.includes(formData.customInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, prev.customInterest.trim()],
        customInterest: ""
      }))
    }
  }

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }))
  }

  const removeInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.fullName && formData.displayName && formData.personalEmail && formData.phoneNumber && usernameAvailable === true)
      case 2:
        return !!(formData.collegeEmail && formData.yearOfStudy && formData.fieldOfStudy)
      case 3:
        return formData.skills.length > 0 && formData.interests.length > 0
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
      setError("")
    } else {
      setError("Please fill in all required fields")
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    setError("")
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      setError("Please complete all steps")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.personalEmail, 
        "tempPassword123!" // You might want to add a password field
      )

      // Update user profile
      await updateProfile(userCredential.user, {
        displayName: formData.displayName
      })

      // Save additional user data to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        fullName: formData.fullName,
        displayName: formData.displayName,
        personalEmail: formData.personalEmail,
        phoneNumber: formData.phoneNumber,
        collegeEmail: formData.collegeEmail,
        yearOfStudy: formData.yearOfStudy,
        fieldOfStudy: formData.fieldOfStudy,
        skills: formData.skills,
        interests: formData.interests,
        createdAt: new Date(),
        profileComplete: true
      })

      setShowWelcome(true)
      
      // Show welcome message for 3 seconds then redirect
      setTimeout(() => {
        onSuccess?.()
      }, 3000)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    setError("")
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      
      // Save user data to Firestore
      await setDoc(doc(db, "users", result.user.uid), {
        fullName: result.user.displayName || "",
        displayName: result.user.displayName || "",
        personalEmail: result.user.email || "",
        phoneNumber: "",
        collegeEmail: "",
        yearOfStudy: "",
        fieldOfStudy: "",
        skills: [],
        interests: [],
        createdAt: new Date(),
        profileComplete: false // User will need to complete profile later
      })

      setShowWelcome(true)
      setTimeout(() => {
        onSuccess?.()
      }, 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (showWelcome) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Welcome to Socials!</h2>
          <p className="text-muted-foreground mb-6">Your account has been created successfully. Redirecting to your dashboard...</p>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
          <p className="text-muted-foreground">Step {currentStep} of {totalSteps}</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 mt-4">
            <div 
              className={`bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ${
                currentStep === 1 ? 'progress-33' : currentStep === 2 ? 'progress-66' : 'progress-100'
              }`}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => updateFormData("fullName", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name *</Label>
                    <div className="relative">
                      <Input
                        id="displayName"
                        placeholder="How others will see you"
                        value={formData.displayName}
                        onChange={(e) => updateFormData("displayName", e.target.value)}
                        className={usernameAvailable === false ? "border-red-500" : usernameAvailable === true ? "border-green-500" : ""}
                      />
                      {checkingUsername && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    {formData.displayName && (
                      <div className="text-xs">
                        {usernameAvailable === true && (
                          <span className="text-green-600">✓ Username is available</span>
                        )}
                        {usernameAvailable === false && (
                          <span className="text-red-600">✗ Username is already taken</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personalEmail">Personal Email *</Label>
                  <Input
                    id="personalEmail"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.personalEmail}
                    onChange={(e) => updateFormData("personalEmail", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phoneNumber}
                    onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-semibold">Academic Information</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collegeEmail">College Email ID *</Label>
                  <Input
                    id="collegeEmail"
                    type="email"
                    placeholder="student@college.edu"
                    value={formData.collegeEmail}
                    onChange={(e) => updateFormData("collegeEmail", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Year of Study *</Label>
                    <Select value={formData.yearOfStudy} onValueChange={(value) => updateFormData("yearOfStudy", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {YEARS_OF_STUDY.map((year) => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Field of Study *</Label>
                    <Select value={formData.fieldOfStudy} onValueChange={(value) => updateFormData("fieldOfStudy", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {FIELDS_OF_STUDY.map((field) => (
                          <SelectItem key={field} value={field}>{field}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-lg font-semibold">Skills & Interests</h3>
                </div>

                {/* Skills Section */}
                <div className="space-y-3">
                  <Label>Skills * (Select at least one)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                    {SKILLS_OPTIONS.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={`skill-${skill}`}
                          checked={formData.skills.includes(skill)}
                          onCheckedChange={() => handleSkillToggle(skill)}
                        />
                        <Label htmlFor={`skill-${skill}`} className="text-sm">{skill}</Label>
                      </div>
                    ))}
                  </div>
                  
                  {/* Custom Skill Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom skill"
                      value={formData.customSkill}
                      onChange={(e) => updateFormData("customSkill", e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                    />
                    <Button type="button" onClick={addCustomSkill} variant="outline">
                      Add
                    </Button>
                  </div>
                  
                  {/* Selected Skills */}
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                          {skill} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interests Section */}
                <div className="space-y-3">
                  <Label>Interests * (Select at least one)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                    {INTERESTS_OPTIONS.map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox
                          id={`interest-${interest}`}
                          checked={formData.interests.includes(interest)}
                          onCheckedChange={() => handleInterestToggle(interest)}
                        />
                        <Label htmlFor={`interest-${interest}`} className="text-sm">{interest}</Label>
                      </div>
                    ))}
                  </div>
                  
                  {/* Custom Interest Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom interest"
                      value={formData.customInterest}
                      onChange={(e) => updateFormData("customInterest", e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
                    />
                    <Button type="button" onClick={addCustomInterest} variant="outline">
                      Add
                    </Button>
                  </div>
                  
                  {/* Selected Interests */}
                  {formData.interests.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.interests.map((interest) => (
                        <Badge key={interest} variant="secondary" className="cursor-pointer" onClick={() => removeInterest(interest)}>
                          {interest} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-md"
            >
              {error}
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep} disabled={loading}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              {onBack && (
                <Button variant="ghost" onClick={onBack} disabled={loading}>
                  Back to Login
                </Button>
              )}
              
              {currentStep < totalSteps ? (
                <Button onClick={nextStep} disabled={loading}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              )}
            </div>
          </div>

          {/* Google Signup Option */}
          {currentStep === 1 && (
            <>
              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-muted"></div>
                <span className="mx-3 text-xs text-muted-foreground">OR</span>
                <div className="flex-1 h-px bg-muted"></div>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={handleGoogleSignup}
                disabled={loading}
              >
                <FcGoogle className="h-5 w-5" />
                Continue with Google
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
