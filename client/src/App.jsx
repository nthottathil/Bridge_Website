import { useState, useEffect } from 'react';
import {
  Rocket, TrendingUp, Sprout, Heart,
  Activity, Lightbulb, Palette,
  Trophy, Mountain, HeartHandshake, Utensils, Plane, Leaf,
  Laptop, Briefcase, Brain, Microscope, BookOpen, Scale, Landmark, Globe, TreePine, Languages, Building2,
  Music, Gamepad2, Tv, Film, Camera, Paintbrush, Book, PenTool
} from 'lucide-react';
import './index.css';

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState({
    personality: '',
    interests: [],
    goals: [],
    expertise: [],
    description: ''
  });
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [editProfileData, setEditProfileData] = useState({
    name: '',
    age: '',
    personality: '',
    interests: [],
    goals: [],
    expertise: [],
    description: ''
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch(`${API_URL}/api/user/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(user => {
        setUserData(user);
        setCurrentView(user.onboardingCompleted ? 'dashboard' : 'verification');
      })
      .catch(() => localStorage.removeItem('token'));
  }, []);

  // Personality options
  const personalityOptions = [
    { id: 'introvert-thinker', label: 'Quiet Thinker', description: 'I prefer deep conversations with a few people' },
    { id: 'extrovert-social', label: 'Social Butterfly', description: 'I gain energy from being around others' },
    { id: 'ambivert-balanced', label: 'Balanced Mix', description: 'I enjoy both solitude and social time equally' },
    { id: 'introvert-creative', label: 'Creative Soul', description: 'I express myself better through art/writing than words' },
    { id: 'extrovert-leader', label: 'Natural Leader', description: 'I often take charge in group situations' },
    { id: 'analytical', label: 'Analytical Mind', description: 'I approach problems logically and systematically' }
  ];

  // Interest categories with icons — pick top 5 (ranked)
  const interestCategories = [
    {
      name: 'Active & Lifestyle',
      icon: Activity,
      items: [
        { name: 'Sport', icon: Trophy },
        { name: 'Outdoor & Adventure', icon: Mountain },
        { name: 'Wellbeing', icon: HeartHandshake },
        { name: 'Food & Drink', icon: Utensils },
        { name: 'Travel', icon: Plane },
        { name: 'Nature & Animals', icon: Leaf }
      ]
    },
    {
      name: 'Knowledge & Ideas',
      icon: Lightbulb,
      items: [
        { name: 'Technology', icon: Laptop },
        { name: 'Business', icon: Briefcase },
        { name: 'Psychology', icon: Brain },
        { name: 'Science', icon: Microscope },
        { name: 'Humanities', icon: BookOpen },
        { name: 'Law', icon: Scale },
        { name: 'Politics', icon: Landmark },
        { name: 'Social Impact', icon: Globe },
        { name: 'Environment', icon: TreePine },
        { name: 'Languages', icon: Languages },
        { name: 'Architecture', icon: Building2 }
      ]
    },
    {
      name: 'Culture & Entertainment',
      icon: Palette,
      items: [
        { name: 'Music', icon: Music },
        { name: 'Gaming', icon: Gamepad2 },
        { name: 'Media & Pop Culture', icon: Tv },
        { name: 'Film & Video', icon: Film },
        { name: 'Photography', icon: Camera },
        { name: 'Art & Design', icon: Paintbrush },
        { name: 'Reading', icon: Book },
        { name: 'Writing', icon: PenTool }
      ]
    }
  ];

  // Goals — pick ONE sub-goal only (matches you with people who picked the same)
  const goalCategories = [
    {
      name: 'Build',
      tagline: 'I want to create something',
      icon: Rocket,
      subGoals: [
        'Launch a startup',
        'Build a side project/app',
        'Grow a brand/audience',
        'Launch a social enterprise'
      ]
    },
    {
      name: 'Climb',
      tagline: 'I want to advance my career',
      icon: TrendingUp,
      subGoals: [
        'Land my first graduate role',
        'Switch industries',
        'Get promoted/grow in my current role',
        'Build a professional skill set'
      ]
    },
    {
      name: 'Grow',
      tagline: 'I want to become a better version of myself',
      icon: Sprout,
      subGoals: [
        'Settling into a new city',
        'Mental health & emotional wellbeing',
        'Fitness & physical health',
        'Building better habits & self-improvement'
      ]
    },
    {
      name: 'Passion',
      tagline: 'I want to find my people',
      icon: Heart,
      subGoals: [
        'Meet people with similar interests'
      ]
    }
  ];

  // Expertise areas
  const expertiseOptions = [
    'STEM (Science, Technology, Engineering, Math)',
    'Personal Finance & Investing',
    'Entrepreneurship & Business',
    'Global Perspectives & Culture',
    'Arts & Creative Expression',
    'Health & Wellness',
    'Psychology & Human Behavior',
    'Marketing & Communication',
    'Philosophy & Ethics',
    'Environmental Sustainability'
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setUserData(data.user);

        // Check if user has completed onboarding
        if (data.user.onboardingCompleted) {
          setCurrentView('dashboard');
        } else {
          setCurrentView('verification');
        }
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      alert('Login failed. Is the server running?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Age validation
    const userAge = parseInt(age);
    if (userAge < 18) {
      alert('You must be 18 or older to use Bridge');
      return;
    }
    
    console.log('Attempting signup with:', { email, name, age: userAge });
    
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password, name, age: userAge })
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Signup successful:', data);
        localStorage.setItem('token', data.token);
        setUserData(data.user);
        setCurrentView('verification');
      } else {
        const error = await response.json();
        console.error('Signup error response:', error);
        alert(error.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert(`Signup failed: ${error.message}. Check console for details.`);
    }
  };

  const handleVerification = () => {
    // In a real app, this would integrate with a government ID verification service
    alert('Government ID verification would happen here. For demo purposes, proceeding to onboarding.');
    setCurrentView('onboarding');
  };

  const handleOnboardingSubmit = async () => {
    // Validate all fields
    if (!onboardingData.personality) {
      alert('Please select your personality type');
      return;
    }
    if (onboardingData.interests.length !== 5) {
      alert('Please select and rank your top 5 interests');
      return;
    }
    if (onboardingData.goals.length !== 1) {
      alert('Please select one sub-goal');
      return;
    }
    if (onboardingData.expertise.length === 0) {
      alert('Please select at least one area of expertise');
      return;
    }
    if (onboardingData.description.trim().split(' ').length > 30) {
      alert('Description must be 30 words or less');
      return;
    }
    if (onboardingData.description.trim().length < 10) {
      alert('Please write a meaningful description of yourself');
      return;
    }

    try {
      const token = localStorage.getItem('token');
              const response = await fetch(`${API_URL}/api/user/onboarding`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(onboardingData)
      });

      if (response.ok) {
        setCurrentView('matching');
        startMatching();
      } else {
        alert('Failed to save profile. Please try again.');
      }
    } catch (error) {
      alert('Error saving profile. Please check your connection.');
    }
  };

  const startMatching = async () => {
    setIsMatching(true);
    
    // Simulate matching process
    setTimeout(async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/matching/find-group`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setMatchResult(data);
          if (data.matched) {
            setTimeout(() => {
              setCurrentView('dashboard');
            }, 3000);
          }
        }
      } catch (error) {
        console.error('Matching error:', error);
      }
      setIsMatching(false);
    }, 5000);
  };

  const fetchProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setEditProfileData({
          name: data.name || '',
          age: data.age ? String(data.age) : '',
          personality: data.personality || '',
          interests: data.interests?.map(ui => ui.interest.name) || [],
          goals: data.UserGoal?.map(ug => ug.goal.name) || [],
          expertise: data.UserExpertise?.map(ue => ue.expertise.name) || [],
          description: data.description || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
    setIsLoadingProfile(false);
  };

  const handleEditProfileSubmit = async () => {
    if (!editProfileData.personality) {
      alert('Please select your personality type');
      return;
    }
    if (editProfileData.interests.length < 3) {
      alert('Please select at least 3 interests');
      return;
    }
    if (editProfileData.goals.length === 0) {
      alert('Please select at least one goal');
      return;
    }
    if (editProfileData.expertise.length === 0) {
      alert('Please select at least one area of expertise');
      return;
    }
    if (editProfileData.description.trim().split(' ').filter(w => w).length > 30) {
      alert('Description must be 30 words or less');
      return;
    }
    if (editProfileData.description.trim().length < 10) {
      alert('Please write a meaningful description of yourself');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/user/profile/full`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editProfileData)
      });

      if (response.ok) {
        setUserData({ ...userData, name: editProfileData.name, age: parseInt(editProfileData.age) });
        alert('Profile updated successfully!');
        setCurrentView('dashboard');
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      alert('Error updating profile. Please check your connection.');
    }
  };

  // Government Verification View
  if (currentView === 'verification') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Verify Your Identity</h2>
          <div className="text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">🔐</div>
              <p className="text-purple-200 mb-4">
                To ensure the safety of our community, we require government ID verification.
              </p>
              <p className="text-purple-200 text-sm">
                Your data is encrypted and never shared with other users.
              </p>
            </div>
            <button
              onClick={handleVerification}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-semibold hover:shadow-xl transition mb-4"
            >
              Verify with Government ID
            </button>
            <p className="text-purple-300 text-xs">
              This uses secure third-party verification services
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Onboarding View
  if (currentView === 'onboarding') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Let's Get to Know You</h2>
            
            {/* Step 1: Personality */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">1. How would you describe yourself?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {personalityOptions.map(option => (
                  <div
                    key={option.id}
                    onClick={() => setOnboardingData({...onboardingData, personality: option.id})}
                    className={`p-4 rounded-lg cursor-pointer transition ${
                      onboardingData.personality === option.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/20 text-purple-100 hover:bg-white/30'
                    }`}
                  >
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-sm mt-1 opacity-90">{option.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Goals */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-2">2. What's your goal right now?</h3>
              <p className="text-sm text-purple-200 mb-4">
                Select only 1 sub-goal — you'll only meet people who chose the same sub-goal.
              </p>
              <div className="space-y-4">
                {goalCategories.map(cat => {
                  const CatIcon = cat.icon;
                  return (
                    <div key={cat.name} className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <CatIcon className="w-6 h-6 text-purple-200" />
                        <div>
                          <div className="text-white font-semibold">{cat.name}</div>
                          <div className="text-xs text-purple-200 italic">"{cat.tagline}"</div>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-2">
                        {cat.subGoals.map(sg => {
                          const selected = onboardingData.goals[0] === sg;
                          return (
                            <button
                              key={sg}
                              onClick={() => setOnboardingData({...onboardingData, goals: [sg]})}
                              className={`text-left px-4 py-3 rounded-lg text-sm transition ${
                                selected
                                  ? 'bg-purple-500 text-white ring-2 ring-white'
                                  : 'bg-white/10 text-purple-100 hover:bg-white/20'
                              }`}
                            >
                              {sg}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Interests */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-2">
                3. Rank your top 5 interests
              </h3>
              <p className="text-sm text-purple-200 mb-4">
                Pick from any category — the order you tap them becomes your rank (1–5).
                <span className="ml-2 text-white font-medium">{onboardingData.interests.length}/5 selected</span>
              </p>
              <div className="space-y-4">
                {interestCategories.map(cat => {
                  const CatIcon = cat.icon;
                  return (
                    <div key={cat.name} className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <CatIcon className="w-5 h-5 text-purple-200" />
                        <h4 className="text-purple-100 font-semibold">{cat.name}</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cat.items.map(item => {
                          const ItemIcon = item.icon;
                          const rank = onboardingData.interests.indexOf(item.name);
                          const selected = rank !== -1;
                          const atLimit = onboardingData.interests.length >= 5 && !selected;
                          return (
                            <button
                              key={item.name}
                              disabled={atLimit}
                              onClick={() => {
                                const interests = selected
                                  ? onboardingData.interests.filter(i => i !== item.name)
                                  : [...onboardingData.interests, item.name];
                                setOnboardingData({...onboardingData, interests});
                              }}
                              className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm transition ${
                                selected
                                  ? 'bg-purple-500 text-white'
                                  : atLimit
                                    ? 'bg-white/10 text-purple-200/50 cursor-not-allowed'
                                    : 'bg-white/20 text-purple-100 hover:bg-white/30'
                              }`}
                            >
                              <ItemIcon className="w-4 h-4" />
                              <span>{item.name}</span>
                              {selected && (
                                <span className="ml-1 bg-white text-purple-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                  {rank + 1}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Expertise */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">4. What knowledge can you share?</h3>
              <div className="space-y-3">
                {expertiseOptions.map(expertise => (
                  <button
                    key={expertise}
                    onClick={() => {
                      const expertiseList = onboardingData.expertise.includes(expertise)
                        ? onboardingData.expertise.filter(e => e !== expertise)
                        : [...onboardingData.expertise, expertise];
                      setOnboardingData({...onboardingData, expertise: expertiseList});
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      onboardingData.expertise.includes(expertise)
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/20 text-purple-100 hover:bg-white/30'
                    }`}
                  >
                    {expertise}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 5: Description */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">
                5. Describe yourself in one sentence (30 words max)
              </h3>
              <textarea
                value={onboardingData.description}
                onChange={(e) => setOnboardingData({...onboardingData, description: e.target.value})}
                placeholder="I'm a curious soul who loves deep conversations about technology and philosophy..."
                className="w-full p-4 rounded-lg bg-white/20 text-white placeholder-purple-200 resize-none"
                rows="3"
              />
              <div className="text-purple-200 text-sm mt-2">
                Words: {onboardingData.description.trim().split(' ').filter(w => w).length}/30
              </div>
            </div>

            <button
              onClick={handleOnboardingSubmit}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-semibold hover:shadow-xl transition"
            >
              Start Finding Your Tribe
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Matching/Waiting Area View
  if (currentView === 'matching') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Finding Your Tribe</h2>
          
          {isMatching ? (
            <>
              <div className="mb-8">
                <div className="animate-pulse">
                  <div className="text-6xl mb-4">🔍</div>
                  <div className="flex justify-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
                <p className="text-purple-200">
                  Analyzing compatibility with thousands of users...
                </p>
                <p className="text-purple-300 text-sm mt-2">
                  This usually takes 10-30 seconds
                </p>
              </div>
              
              <div className="space-y-2 text-purple-200 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <span>✓</span>
                  <span>Analyzing personality match</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span>✓</span>
                  <span>Finding shared interests</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="animate-pulse">⏳</span>
                  <span>Creating perfect group...</span>
                </div>
              </div>
            </>
          ) : matchResult ? (
            <div>
              {matchResult.matched ? (
                <>
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-white mb-4">Match Found!</h3>
                  <p className="text-purple-200 mb-4">
                    We found the perfect group for you with {matchResult.group?.members?.length || 5} like-minded people!
                  </p>
                  <p className="text-purple-300 text-sm">
                    Redirecting to your group chat...
                  </p>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">⏰</div>
                  <h3 className="text-xl font-bold text-white mb-4">Almost there!</h3>
                  <p className="text-purple-200 mb-4">
                    {matchResult.message || 'We\'re gathering more compatible people. Check back in a few minutes!'}
                  </p>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition"
                  >
                    Go to Dashboard
                  </button>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  // Login View
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-lg bg-white/20 text-white placeholder-purple-200 mb-4"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-lg bg-white/20 text-white placeholder-purple-200 mb-6"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-semibold hover:shadow-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-center text-purple-200 mt-4">
            Don't have an account?{' '}
            <button onClick={() => setCurrentView('signup')} className="text-white hover:underline">
              Sign up
            </button>
          </p>
          <button 
            onClick={() => setCurrentView('landing')} 
            className="text-purple-200 hover:text-white mt-4 w-full text-center"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // Signup View
  if (currentView === 'signup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Join Bridge</h2>
          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 rounded-lg bg-white/20 text-white placeholder-purple-200 mb-4"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-lg bg-white/20 text-white placeholder-purple-200 mb-4"
              required
            />
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full p-4 rounded-lg bg-white/20 text-white placeholder-purple-200 mb-4"
              min="18"
              max="120"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-lg bg-white/20 text-white placeholder-purple-200 mb-4"
              required
            />
            <p className="text-purple-200 text-sm mb-4">
              You must be 18 or older to use Bridge. Your age will be verified.
            </p>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-semibold hover:shadow-xl transition"
            >
              Create Account
            </button>
          </form>
          <p className="text-center text-purple-200 mt-4">
            Already have an account?{' '}
            <button onClick={() => setCurrentView('login')} className="text-white hover:underline">
              Login
            </button>
          </p>
          <button 
            onClick={() => setCurrentView('landing')} 
            className="text-purple-200 hover:text-white mt-4 w-full text-center"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // Edit Profile View
  if (currentView === 'editProfile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Edit Profile</h2>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="text-purple-200 hover:text-white transition"
              >
                Cancel
              </button>
            </div>

            {isLoadingProfile ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4 animate-pulse">Loading...</div>
                <p className="text-purple-200">Fetching your profile...</p>
              </div>
            ) : (
              <>
                {/* Basic Info */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Basic Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-purple-200 text-sm mb-1">Name</label>
                      <input
                        type="text"
                        value={editProfileData.name}
                        onChange={(e) => setEditProfileData({...editProfileData, name: e.target.value})}
                        className="w-full p-4 rounded-lg bg-white/20 text-white placeholder-purple-200"
                      />
                    </div>
                    <div>
                      <label className="block text-purple-200 text-sm mb-1">Age</label>
                      <input
                        type="number"
                        value={editProfileData.age}
                        onChange={(e) => setEditProfileData({...editProfileData, age: e.target.value})}
                        className="w-full p-4 rounded-lg bg-white/20 text-white placeholder-purple-200"
                        min="18"
                        max="120"
                      />
                    </div>
                  </div>
                </div>

                {/* Personality */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">1. How would you describe yourself?</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {personalityOptions.map(option => (
                      <div
                        key={option.id}
                        onClick={() => setEditProfileData({...editProfileData, personality: option.id})}
                        className={`p-4 rounded-lg cursor-pointer transition ${
                          editProfileData.personality === option.id
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/20 text-purple-100 hover:bg-white/30'
                        }`}
                      >
                        <div className="font-semibold">{option.label}</div>
                        <div className="text-sm mt-1 opacity-90">{option.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Goals */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-2">2. What's your goal right now?</h3>
                  <p className="text-sm text-purple-200 mb-4">
                    Select only 1 sub-goal — you'll only meet people who chose the same sub-goal.
                  </p>
                  <div className="space-y-4">
                    {goalCategories.map(cat => {
                      const CatIcon = cat.icon;
                      return (
                        <div key={cat.name} className="bg-white/5 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <CatIcon className="w-6 h-6 text-purple-200" />
                            <div>
                              <div className="text-white font-semibold">{cat.name}</div>
                              <div className="text-xs text-purple-200 italic">"{cat.tagline}"</div>
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-2">
                            {cat.subGoals.map(sg => {
                              const selected = editProfileData.goals[0] === sg;
                              return (
                                <button
                                  key={sg}
                                  onClick={() => setEditProfileData({...editProfileData, goals: [sg]})}
                                  className={`text-left px-4 py-3 rounded-lg text-sm transition ${
                                    selected
                                      ? 'bg-purple-500 text-white ring-2 ring-white'
                                      : 'bg-white/10 text-purple-100 hover:bg-white/20'
                                  }`}
                                >
                                  {sg}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Interests */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    3. Rank your top 5 interests
                  </h3>
                  <p className="text-sm text-purple-200 mb-4">
                    Pick from any category — the order you tap them becomes your rank (1–5).
                    <span className="ml-2 text-white font-medium">{editProfileData.interests.length}/5 selected</span>
                  </p>
                  <div className="space-y-4">
                    {interestCategories.map(cat => {
                      const CatIcon = cat.icon;
                      return (
                        <div key={cat.name} className="bg-white/5 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <CatIcon className="w-5 h-5 text-purple-200" />
                            <h4 className="text-purple-100 font-semibold">{cat.name}</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {cat.items.map(item => {
                              const ItemIcon = item.icon;
                              const rank = editProfileData.interests.indexOf(item.name);
                              const selected = rank !== -1;
                              const atLimit = editProfileData.interests.length >= 5 && !selected;
                              return (
                                <button
                                  key={item.name}
                                  disabled={atLimit}
                                  onClick={() => {
                                    const interests = selected
                                      ? editProfileData.interests.filter(i => i !== item.name)
                                      : [...editProfileData.interests, item.name];
                                    setEditProfileData({...editProfileData, interests});
                                  }}
                                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm transition ${
                                    selected
                                      ? 'bg-purple-500 text-white'
                                      : atLimit
                                        ? 'bg-white/10 text-purple-200/50 cursor-not-allowed'
                                        : 'bg-white/20 text-purple-100 hover:bg-white/30'
                                  }`}
                                >
                                  <ItemIcon className="w-4 h-4" />
                                  <span>{item.name}</span>
                                  {selected && (
                                    <span className="ml-1 bg-white text-purple-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                      {rank + 1}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Expertise */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">4. What knowledge can you share?</h3>
                  <div className="space-y-3">
                    {expertiseOptions.map(expertise => (
                      <button
                        key={expertise}
                        onClick={() => {
                          const expertiseList = editProfileData.expertise.includes(expertise)
                            ? editProfileData.expertise.filter(e => e !== expertise)
                            : [...editProfileData.expertise, expertise];
                          setEditProfileData({...editProfileData, expertise: expertiseList});
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg transition ${
                          editProfileData.expertise.includes(expertise)
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/20 text-purple-100 hover:bg-white/30'
                        }`}
                      >
                        {expertise}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    5. Describe yourself in one sentence (30 words max)
                  </h3>
                  <textarea
                    value={editProfileData.description}
                    onChange={(e) => setEditProfileData({...editProfileData, description: e.target.value})}
                    placeholder="I'm a curious soul who loves deep conversations about technology and philosophy..."
                    className="w-full p-4 rounded-lg bg-white/20 text-white placeholder-purple-200 resize-none"
                    rows="3"
                  />
                  <div className="text-purple-200 text-sm mt-2">
                    Words: {editProfileData.description.trim().split(' ').filter(w => w).length}/30
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleEditProfileSubmit}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-semibold hover:shadow-xl transition"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="px-8 bg-white/20 text-white py-4 rounded-lg font-semibold hover:bg-white/30 transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Dashboard View
  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">Welcome to Bridge!</h1>
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  setCurrentView('landing');
                }}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Your Profile</h3>
                <p className="text-purple-200">
                  {userData?.name || 'User'}<br/>
                  Age: {userData?.age || 'N/A'}
                </p>
                <button
                  onClick={() => {
                    fetchProfile();
                    setCurrentView('editProfile');
                  }}
                  className="mt-3 bg-purple-500/50 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition text-sm"
                >
                  Edit Profile
                </button>
              </div>
              
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Active Groups</h3>
                <p className="text-purple-200">
                  You're in 1 active group
                </p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Connections</h3>
                <p className="text-purple-200">
                  5 new connections this week
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Your Groups</h2>
            <div className="bg-white/10 rounded-lg p-6">
              <p className="text-purple-200">
                Your matched groups will appear here. Start chatting with your tribe!
              </p>
              <button
                onClick={() => {
                  setCurrentView('matching');
                  startMatching();
                }}
                className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition"
              >
                Find New Group
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Landing Page (default)
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <nav className="p-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-white">🌉 Bridge</span>
        </div>
        <div className="space-x-4">
          <button 
            onClick={() => setCurrentView('login')}
            className="text-white hover:text-purple-200 transition"
          >
            Login
          </button>
          <button 
            onClick={() => setCurrentView('signup')}
            className="bg-white text-purple-900 px-6 py-2 rounded-full font-semibold hover:bg-purple-100 transition"
          >
            Sign Up
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-6 pt-20 pb-32 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Find Your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Tribe
          </span>
        </h1>
        <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
          Bridge connects you with small groups of like-minded people for meaningful conversations and lasting friendships.
        </p>
        <button 
          onClick={() => setCurrentView('signup')}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition duration-300"
        >
          Start Your Journey
        </button>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-white mb-2">Smart Matching</h3>
            <p className="text-purple-200">Our algorithm finds your perfect group based on personality and interests.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-white mb-2">Verified & Safe</h3>
            <p className="text-purple-200">Government ID verification ensures a trusted community.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-xl font-bold text-white mb-2">Knowledge Exchange</h3>
            <p className="text-purple-200">Share your expertise and learn from others in your group.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;