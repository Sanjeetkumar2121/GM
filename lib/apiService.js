// Mock API service - simulates backend API calls

// Mock data
const mockOpportunities = [
  {
    id: '1',
    title: 'Software Engineer Internship',
    description: 'Join our engineering team for a summer internship focused on full-stack development.',
    category: 'Internship',
    location: 'San Francisco, CA',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    company: 'Tech Corp',
    requirements: ['JavaScript', 'React', 'Node.js'],
    stipend: '$5,000/month',
    duration: '3 months',
    fullDescription: 'Join our engineering team for a summer internship focused on full-stack development. You will work on real projects with experienced mentors.',
  },
  {
    id: '2',
    title: 'UX/UI Design Fellowship',
    description: 'A competitive fellowship program for emerging designers to work on impactful projects.',
    category: 'Fellowship',
    location: 'New York, NY',
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    company: 'Design Studio',
    requirements: ['Figma', 'Design Thinking', 'Portfolio'],
    stipend: '$7,000/month',
    duration: '6 months',
    fullDescription: 'A competitive fellowship program for emerging designers to work on impactful projects with leading brands.',
  },
  {
    id: '3',
    title: 'Product Management Accelerator',
    description: 'Build product management skills through real-world projects and mentorship.',
    category: 'Accelerator',
    location: 'Remote',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    company: 'PM Academy',
    requirements: ['Analytical skills', 'Communication', 'Product sense'],
    stipend: '$3,000/month',
    duration: '3 months',
    fullDescription: 'Build product management skills through real-world projects and mentorship from industry leaders.',
  },
]

const mockTasks = [
  {
    id: '1',
    opportunityId: '1',
    title: 'Submit Resume',
    description: 'Prepare and submit your resume for the Software Engineer Internship',
    status: 'pending',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    submissionType: 'file',
  },
  {
    id: '2',
    opportunityId: '1',
    title: 'Complete Online Assessment',
    description: 'Complete the coding assessment on the company portal',
    status: 'in_progress',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    submissionType: 'link',
  },
  {
    id: '3',
    opportunityId: '2',
    title: 'Build Portfolio Project',
    description: 'Create a design case study showcasing your UX/UI skills',
    status: 'pending',
    dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    submissionType: 'link',
  },
]

// API Functions
export const apiService = {
  // Opportunities
  getOpportunities: async (filters = {}) => {
    return new Promise(resolve => {
      setTimeout(() => {
        let results = [...mockOpportunities]
        if (filters.category) {
          results = results.filter(o => o.category === filters.category)
        }
        if (filters.search) {
          results = results.filter(o =>
            o.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            o.description.toLowerCase().includes(filters.search.toLowerCase())
          )
        }
        resolve(results)
      }, 500)
    })
  },

  getOpportunityById: async (id) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockOpportunities.find(o => o.id === id))
      }, 300)
    })
  },

  applyToOpportunity: async (opportunityId) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Application submitted successfully',
          opportunityId,
        })
      }, 800)
    })
  },

  // Tasks
  getTasks: async (filters = {}) => {
    return new Promise(resolve => {
      setTimeout(() => {
        let results = [...mockTasks]
        if (filters.opportunityId) {
          results = results.filter(t => t.opportunityId === filters.opportunityId)
        }
        if (filters.status) {
          results = results.filter(t => t.status === filters.status)
        }
        resolve(results)
      }, 500)
    })
  },

  getTaskById: async (id) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockTasks.find(t => t.id === id))
      }, 300)
    })
  },

  updateTaskStatus: async (taskId, status) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const task = mockTasks.find(t => t.id === taskId)
        if (task) {
          task.status = status
          resolve(task)
        } else {
          resolve(null)
        }
      }, 400)
    })
  },

  submitTask: async (taskId, submissionData) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Submission received',
          taskId,
          submission: {
            id: Math.random().toString(36).substr(2, 9),
            taskId,
            ...submissionData,
            submittedAt: new Date().toISOString(),
          },
        })
      }, 1000)
    })
  },
}
