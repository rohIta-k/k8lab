package experiment

var experiments = []Experiment{
	{
		ID:            "crashloopbackoff",
		Name:          "CrashLoopBackOff",
		Category:      "Pod Lifecycle",
		Difficulty:    "Beginner",
		Description:   "Creates a pod that repeatedly crashes to observe Kubernetes restart behavior.",
		Namespace:     "default",
		EstimatedTime: "15 sec",
		Resources: []string{
			"Deployment",
			"ReplicaSet",
			"Pod",
		},
		Configuration: map[string]interface{}{
			"deploymentName": "crash-demo",
			"image":          "busybox",
			"replicas":       1,
			"command": []string{
				"sh",
				"-c",
				"exit 1",
			},
		},
		ExpectedState: "CrashLoopBackOff",
	},

	{
		ID:            "imagepullbackoff",
		Name:          "ImagePullBackOff",
		Category:      "Pod Lifecycle",
		Difficulty:    "Beginner",
		Description:   "Deploys a pod with an invalid image to demonstrate image pull failures.",
		Namespace:     "default",
		EstimatedTime: "30 sec",
		Resources: []string{
			"Deployment",
			"Pod",
		},
		Configuration: map[string]interface{}{
			"deploymentName": "image-demo",
			"image":          "nginx:notfound",
			"replicas":       1,
		},
		ExpectedState: "ImagePullBackOff",
	},

	{
		ID:            "oomkilled",
		Name:          "OOMKilled",
		Category:      "Pod Lifecycle",
		Difficulty:    "Intermediate",
		Description:   "Creates a memory constrained pod that exceeds its memory limit.",
		Namespace:     "default",
		EstimatedTime: "30 sec",
		Resources: []string{
			"Deployment",
			"Pod",
		},
		Configuration: map[string]interface{}{
			"memoryLimit": "64Mi",
			"image":       "polinux/stress",
		},
		ExpectedState: "OOMKilled",
	},

	{
		ID:            "pendingpod",
		Name:          "Pending Pod",
		Category:      "Scheduling",
		Difficulty:    "Intermediate",
		Description:   "Creates a pod requesting resources that cannot currently be scheduled.",
		Namespace:     "default",
		EstimatedTime: "30 sec",
		Resources: []string{
			"Pod",
		},
		Configuration: map[string]interface{}{
			"cpu":    "32",
			"memory": "64Gi",
		},
		ExpectedState: "Pending",
	},

	{
		ID:            "livenessprobe",
		Name:          "Failed Liveness Probe",
		Category:      "Health Checks",
		Difficulty:    "Advanced",
		Description:   "Creates a pod with an intentionally failing liveness probe.",
		Namespace:     "default",
		EstimatedTime: "30 sec",
		Resources: []string{
			"Deployment",
			"Pod",
		},
		Configuration: map[string]interface{}{
			"initialDelaySeconds": 5,
			"periodSeconds":       5,
		},
		ExpectedState: "Restarting",
	},
}

func GetExperiments() []Experiment {
	return experiments
}

func GetExperiment(id string) (Experiment, bool) {
	for _, experiment := range experiments {
		if experiment.ID == id {
			return experiment, true
		}
	}

	return Experiment{}, false
}
