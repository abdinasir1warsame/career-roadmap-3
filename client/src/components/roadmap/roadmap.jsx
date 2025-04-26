import React, { useState, useEffect } from 'react';
import {
  Clock,
  Code,
  Zap,
  ChevronDown,
  ChevronUp,
  Search,
  Check,
  Circle,
} from 'lucide-react';
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { UserAuth } from '../../context/authContext';
import CareerGoalsEditor from './roadmapUpdate';

// Utility function for class names
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Badge component
function Badge({ className, variant = 'default', children }) {
  const variantStyles = {
    default:
      'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    secondary:
      'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive:
      'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'text-foreground',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
}

// Button component
function Button({ className, children, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// Card components
function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
      {children}
    </div>
  );
}

function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn(
        'text-2xl font-semibold leading-none tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
}

function RoadmapStage({
  stage,
  index,
  isActive,
  onClick,
  onMilestoneToggle,
  completedMilestones,
}) {
  const isStageCompleted = () => {
    if (!stage?.milestones) return false;
    return stage.milestones.every((milestone) =>
      completedMilestones.includes(milestone)
    );
  };

  const isStageInProgress = () => {
    if (!stage?.milestones) return false;
    return (
      stage.milestones.some((milestone) =>
        completedMilestones.includes(milestone)
      ) && !isStageCompleted()
    );
  };

  const completed = isStageCompleted();
  const inProgress = isStageInProgress();

  return (
    <div
      className={cn(
        'relative rounded-xl transition-all duration-300 overflow-hidden',
        isActive ? 'bg-gray-800/60' : 'bg-gray-800/30',
        isActive ? 'border border-blue-500/40' : 'border border-blue-500/20',
        completed &&
          'border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
        'hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:border-blue-500/30'
      )}
    >
      {completed && (
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600"></div>
      )}

      <div
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={onClick}
      >
        <div className="flex flex-col items-start lg:flex-row lg:items-center gap-3">
          <div
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full text-white',
              isActive
                ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                : completed
                ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                : inProgress
                ? 'bg-blue-500'
                : 'bg-gray-700 border border-blue-500/30'
            )}
          >
            <span className="text-lg px-2 lg:px-0 font-bold">{index + 1}</span>
          </div>
          <div>
            <h3 className="font-bold text-lg lg:text-2xl text-white">
              {stage?.name || 'Stage'}
            </h3>
            <div className="flex items-center gap-2 text-gray-400 text-md mt-1">
              <Clock size={12} />
              <span>{stage?.timeframe || 'Timeframe'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={cn(
              completed
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-500/30'
                : inProgress
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-500/30'
                : 'text-gray-400 border-gray-500/30'
            )}
          >
            {completed
              ? 'Completed'
              : inProgress
              ? 'In Progress'
              : 'Not Started'}
          </Badge>
          {isActive ? (
            <ChevronUp size={18} className="text-gray-400" />
          ) : (
            <ChevronDown size={18} className="text-gray-400" />
          )}
        </div>
      </div>

      {isActive && (
        <div className="px-4 pb-4 pt-2 border-t border-blue-500/20">
          <p className="text-gray-400 text-lg mb-4">
            {stage?.description || ''}
          </p>

          {stage?.skills?.length > 0 && (
            <div className="mb-4">
              <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                <Code size={14} className="text-blue-400 font-bold" />
                Key Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {stage.skills.map((skill, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="px-3 py-1 text-sm bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {stage?.milestones?.length > 0 && (
            <div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                <Zap size={14} className="text-purple-400" />
                Milestones
              </h4>
              <ul className="space-y-3 text-lg text-gray-400">
                {stage.milestones.map((milestone, i) => {
                  const isMilestoneComplete =
                    completedMilestones.includes(milestone);
                  return (
                    <li
                      key={i}
                      className="flex items-start gap-3 group cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMilestoneToggle(milestone, !isMilestoneComplete);
                      }}
                    >
                      <div
                        className={cn(
                          'min-w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all',
                          isMilestoneComplete
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-blue-500/30 group-hover:border-blue-500'
                        )}
                      >
                        {isMilestoneComplete ? (
                          <Check size={12} className="text-white" />
                        ) : (
                          <Circle size={12} className="text-transparent" />
                        )}
                      </div>
                      <span
                        className={cn(
                          'transition-all',
                          isMilestoneComplete
                            ? 'text-gray-300 line-through'
                            : 'text-gray-400'
                        )}
                      >
                        {milestone}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CareerRoadmap({ onUpdateClick }) {
  const [openStages, setOpenStages] = useState([]);
  const [roadmapData, setRoadmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    currentLevel: 'Loading...',
    targetRole: 'Loading...',
    completion: 0,
    estimatedTimeline: 'Loading...',
  });
  const [completedMilestones, setCompletedMilestones] = useState([]);
  const { user } = UserAuth();

  // Calculate total milestones count
  const totalMilestones = roadmapData.reduce(
    (total, stage) => total + (stage.milestones?.length || 0),
    0
  );

  // Calculate completed stages count
  const completedStages = roadmapData.filter((stage) =>
    stage.milestones?.every((m) => completedMilestones.includes(m))
  ).length;

  useEffect(() => {
    const fetchRoadmap = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);
        setError(null);

        const docRef = doc(db, 'userRoadmap', user.uid);
        const roadmapDoc = await getDoc(docRef);

        if (!roadmapDoc.exists()) {
          throw new Error('Roadmap not found for this user');
        }

        const roadmap = roadmapDoc.data();
        setRoadmapData(roadmap.roadmap || []);
        setOpenStages(roadmap.roadmap?.map(() => true) || []);
        setCompletedMilestones(roadmap.completedMilestones || []);

        if (roadmap.summary) {
          setUserData({
            currentLevel: roadmap.summary.currentLevel || 'Developer',
            targetRole: roadmap.summary.targetRole || 'Senior Developer',
            estimatedTimeline:
              roadmap.summary.estimatedTimeline || '12-18 months',
            completion: calculateCompletion(
              roadmap.completedMilestones || [],
              roadmap.roadmap || []
            ),
          });
        }
      } catch (err) {
        console.error('Firebase fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [user]);

  const calculateCompletion = (milestones, roadmap) => {
    const total = roadmap.reduce(
      (total, stage) => total + (stage.milestones?.length || 0),
      0
    );
    return total > 0 ? Math.round((milestones.length / total) * 100) : 0;
  };

  const handleMilestoneToggle = async (milestone, isComplete) => {
    try {
      const userRef = doc(db, 'userRoadmap', user.uid);
      let newMilestones;

      if (isComplete) {
        await updateDoc(userRef, {
          completedMilestones: arrayUnion(milestone),
        });
        newMilestones = [...completedMilestones, milestone];
      } else {
        await updateDoc(userRef, {
          completedMilestones: arrayRemove(milestone),
        });
        newMilestones = completedMilestones.filter((m) => m !== milestone);
      }

      setCompletedMilestones(newMilestones);

      // Update completion percentage
      const newCompletion = calculateCompletion(newMilestones, roadmapData);
      await updateDoc(userRef, {
        'summary.completion': newCompletion,
      });

      setUserData((prev) => ({
        ...prev,
        completion: newCompletion,
      }));
    } catch (error) {
      console.error('Error updating milestone:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-bold text-red-500 mb-2">
          Error loading roadmap
        </h3>
        <p className="text-gray-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 rounded-md text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!roadmapData.length) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-bold text-gray-400">
          No roadmap data available
        </h3>
        <p className="text-gray-500">
          We couldn't find a roadmap for this user
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="">
        <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 z-0"></div>
        <div className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gray-800/60 backdrop-blur-md rounded-lg border border-blue-500/30 shadow-lg shadow-blue-500/10 cursor-pointer hover:bg-gray-800 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Current Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{userData.currentLevel}</p>
                <Badge className="mt-2 px-3 text-white rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                  {userData.estimatedTimeline}
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/60 backdrop-blur-md rounded-lg border border-blue-500/30 shadow-lg shadow-blue-500/10 cursor-pointer hover:bg-gray-800 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Target Role
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{userData.targetRole}</p>
                <Badge className="mt-2 px-3 text-white rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                  Next level
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/60 backdrop-blur-md rounded-lg border border-blue-500/30 shadow-lg shadow-blue-500/10 cursor-pointer hover:bg-gray-800 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                      style={{ width: `${userData.completion}%` }}
                    ></div>
                  </div>
                  <span className="text-md font-bold">
                    {userData.completion}%
                  </span>
                </div>
                <p className="text-gray-400 text-md mt-2">
                  {completedMilestones.length} of {totalMilestones} milestones
                  completed
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {completedStages} of {roadmapData.length} stages completed
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {roadmapData.map((stage, index) => (
              <RoadmapStage
                key={index}
                stage={stage}
                index={index}
                isActive={openStages[index]}
                onClick={() => {
                  const newStages = [...openStages];
                  newStages[index] = !newStages[index];
                  setOpenStages(newStages);
                }}
                onMilestoneToggle={handleMilestoneToggle}
                completedMilestones={completedMilestones}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none shadow-lg shadow-blue-700/20 hover:shadow-blue-700/40 transition-all"
          onClick={onUpdateClick}
        >
          Update My Roadmap
        </Button>
      </div>
    </div>
  );
}

export default function RoadmapComponent() {
  const [showEditor, setShowEditor] = useState(false);

  const handleUpdateClick = () => {
    setShowEditor(true);
  };

  const handleCancelEdit = () => {
    setShowEditor(false);
  };

  return (
    <>
      <div className="min-h-screen p-4 md:p-6 ">
        <div className="w-full">
          {showEditor ? (
            <CareerGoalsEditor onCancel={handleCancelEdit} />
          ) : (
            <CareerRoadmap onUpdateClick={handleUpdateClick} />
          )}
        </div>
      </div>
    </>
  );
}
