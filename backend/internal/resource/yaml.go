package resource

import (
	"fmt"

	"sigs.k8s.io/yaml"
)

func objectYAML(
	object interface{},
) (string, error) {
	data, err := yaml.Marshal(object)
	if err != nil {
		return "", fmt.Errorf(
			"failed to convert resource to yaml: %w",
			err,
		)
	}

	return string(data), nil
}
