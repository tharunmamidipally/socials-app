"use client"

import React, { useState, useEffect } from "react"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  Heart, 
  Camera, 
  Plus, 
  X,
  Award,
  FileText,
  Trophy,
  Star
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface UserProfileProps {
  onBack?: () => void
}

interface UserData {
  fullName: string
  displayName: string
  personalEmail: string
  phoneNumber: string
  collegeEmail: string
  yearOfStudy: string
  fieldOfStudy: string
  skills: string[]
  interests: string[]
  achievements: string[]
  certifications: string[]
  profilePicture?: string
  createdAt: any
  profileComplete: boolean
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

export function UserProfile({ onBack }: UserProfileProps) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [newAchievement, setNewAchievement] = useState("")
  const [newCertification, setNewCertification] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [newInterest, setNewInterest] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    if (!auth.currentUser) return
    
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid))
      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData)
      }
    } catch (error) {
      console.error("Error loading user data:", error)
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!userData || !auth.currentUser) return
    
    setSaving(true)
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        displayName: userData.displayName,
        phoneNumber: userData.phoneNumber,
        yearOfStudy: userData.yearOfStudy,
        fieldOfStudy: userData.fieldOfStudy,
        skills: userData.skills,
        interests: userData.interests,
        achievements: userData.achievements,
        certifications: userData.certifications,
        profilePicture: userData.profilePicture,
        updatedAt: new Date()
      })
      
      toast({
        title: "Success",
        description: "Profile updated successfully!"
      })
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !auth.currentUser) return

    setUploading(true)
    try {
      const imageRef = ref(storage, `profile-pictures/${auth.currentUser.uid}`)
      await uploadBytes(imageRef, file)
      const downloadURL = await getDownloadURL(imageRef)
      
      setUserData(prev => prev ? { ...prev, profilePicture: downloadURL } : null)
      
      toast({
        title: "Success",
        description: "Profile picture updated!"
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const addAchievement = () => {
    if (newAchievement.trim() && userData) {
      setUserData({
        ...userData,
        achievements: [...(userData.achievements || []), newAchievement.trim()]
      })
      setNewAchievement("")
    }
  }

  const removeAchievement = (index: number) => {
    if (userData && userData.achievements) {
      setUserData({
        ...userData,
        achievements: userData.achievements.filter((_, i) => i !== index)
      })
    }
  }

  const addCertification = () => {
    if (newCertification.trim() && userData) {
      setUserData({
        ...userData,
        certifications: [...(userData.certifications || []), newCertification.trim()]
      })
      setNewCertification("")
    }
  }

  const removeCertification = (index: number) => {
    if (userData && userData.certifications) {
      setUserData({
        ...userData,
        certifications: userData.certifications.filter((_, i) => i !== index)
      })
    }
  }

  const handleSkillToggle = (skill: string) => {
    if (!userData) return
    
    const currentSkills = userData.skills || []
    setUserData({
      ...userData,
      skills: currentSkills.includes(skill)
        ? currentSkills.filter(s => s !== skill)
        : [...currentSkills, skill]
    })
  }

  const handleInterestToggle = (interest: string) => {
    if (!userData) return
    
    const currentInterests = userData.interests || []
    setUserData({
      ...userData,
      interests: currentInterests.includes(interest)
        ? currentInterests.filter(i => i !== interest)
        : [...currentInterests, interest]
    })
  }

  const addCustomSkill = () => {
    if (newSkill.trim() && userData) {
      const currentSkills = userData.skills || []
      if (!currentSkills.includes(newSkill.trim())) {
        setUserData({
          ...userData,
          skills: [...currentSkills, newSkill.trim()]
        })
        setNewSkill("")
      }
    }
  }

  const addCustomInterest = () => {
    if (newInterest.trim() && userData) {
      const currentInterests = userData.interests || []
      if (!currentInterests.includes(newInterest.trim())) {
        setUserData({
          ...userData,
          interests: [...currentInterests, newInterest.trim()]
        })
        setNewInterest("")
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground">Profile not found</p>
          {onBack && (
            <Button onClick={onBack} className="mt-4">
              Go Back
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your profile information</p>
          </div>
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="skills">Skills & Interests</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
                      <AvatarImage src={userData.profilePicture} alt="Profile" />
                      <AvatarFallback>
                        <User className="w-12 h-12" />
                      </AvatarFallback>
                    </Avatar>
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                      <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                      aria-label="Upload profile picture"
                    />
                    </label>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-semibold">{userData.displayName}</h3>
                    <p className="text-muted-foreground">{userData.fieldOfStudy}</p>
                    {uploading && <p className="text-sm text-blue-600">Uploading...</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={userData.fullName}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">This field cannot be changed</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={userData.displayName}
                      onChange={(e) => setUserData({ ...userData, displayName: e.target.value })}
                      placeholder="How others will see you"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="personalEmail">Personal Email</Label>
                    <Input
                      id="personalEmail"
                      value={userData.personalEmail}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">This field cannot be changed</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={userData.phoneNumber}
                      onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collegeEmail">College Email</Label>
                  <Input
                    id="collegeEmail"
                    value={userData.collegeEmail}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">This field cannot be changed</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Year of Study</Label>
                    <Select value={userData.yearOfStudy} onValueChange={(value) => setUserData({ ...userData, yearOfStudy: value })}>
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
                    <Label>Field of Study</Label>
                    <Select value={userData.fieldOfStudy} onValueChange={(value) => setUserData({ ...userData, fieldOfStudy: value })}>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Skills & Interests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Skills Section */}
                <div className="space-y-3">
                  <Label>Skills</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                    {SKILLS_OPTIONS.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`profile-skill-${skill}`}
                          checked={userData.skills ? userData.skills.includes(skill) : false}
                          onChange={() => handleSkillToggle(skill)}
                          className="rounded"
                          aria-label={`Select skill: ${skill}`}
                        />
                        <Label htmlFor={`profile-skill-${skill}`} className="text-sm">{skill}</Label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                    />
                    <Button type="button" onClick={addCustomSkill} variant="outline">
                      Add
                    </Button>
                  </div>
                  
                  {userData.skills && userData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {userData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interests Section */}
                <div className="space-y-3">
                  <Label>Interests</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                    {INTERESTS_OPTIONS.map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`profile-interest-${interest}`}
                          checked={userData.interests ? userData.interests.includes(interest) : false}
                          onChange={() => handleInterestToggle(interest)}
                          className="rounded"
                          aria-label={`Select interest: ${interest}`}
                        />
                        <Label htmlFor={`profile-interest-${interest}`} className="text-sm">{interest}</Label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom interest"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
                    />
                    <Button type="button" onClick={addCustomInterest} variant="outline">
                      Add
                    </Button>
                  </div>
                  
                  {userData.interests && userData.interests.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {userData.interests.map((interest) => (
                        <Badge key={interest} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Achievements */}
                <div className="space-y-3">
                  <Label>Achievements</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add an achievement"
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
                    />
                    <Button type="button" onClick={addAchievement} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {userData.achievements && userData.achievements.length > 0 && (
                    <div className="space-y-2">
                      {userData.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span>{achievement}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAchievement(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Certifications */}
                <div className="space-y-3">
                  <Label>Certifications</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a certification"
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                    />
                    <Button type="button" onClick={addCertification} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {userData.certifications && userData.certifications.length > 0 && (
                    <div className="space-y-2">
                      {userData.certifications.map((certification, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <span>{certification}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCertification(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="px-8">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}
