package resource

import (
	"fmt"
	"time"

	"k8s.io/apimachinery/pkg/api/resource"
)

func age(t time.Time) string {
	if t.IsZero() {
		return "-"
	}

	d := time.Since(t)

	if d < time.Minute {
		return "0m"
	}

	if d < time.Hour {
		return fmt.Sprintf(
			"%dm",
			int(d.Minutes()),
		)
	}

	if d < 24*time.Hour {
		return fmt.Sprintf(
			"%dh",
			int(d.Hours()),
		)
	}

	return fmt.Sprintf(
		"%dd",
		int(d.Hours()/24),
	)
}

func resourceQuantity(
	value string,
) (resource.Quantity, error) {
	quantity, err := resource.ParseQuantity(value)

	if err != nil {
		return resource.Quantity{}, fmt.Errorf(
			"invalid storage value %q: %w",
			value,
			err,
		)
	}

	return quantity, nil
}
