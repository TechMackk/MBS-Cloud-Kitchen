export type Coordinates = {
  lat: number;
  lng: number;
};

const RESTAURANT_COORDS: Coordinates = {
  lat: 17.4065,
  lng: 78.4772,
};

const GEOLOCATION_TIMEOUT_MS = 5000;

export type GeolocationErrorCode =
  | "unsupported"
  | "denied"
  | "timeout"
  | "unavailable";

export class GeolocationError extends Error {
  readonly code: GeolocationErrorCode;

  constructor(code: GeolocationErrorCode, message: string) {
    super(message);
    this.name = "GeolocationError";
    this.code = code;
  }
}

export function getRestaurantCoords(): Coordinates {
  return { ...RESTAURANT_COORDS };
}

export function buildDirectionsUrl(
  userLat?: number,
  userLng?: number,
): string {
  const { lat, lng } = getRestaurantCoords();
  const destination = `${lat},${lng}`;

  if (userLat !== undefined && userLng !== undefined) {
    const origin = `${userLat},${userLng}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
}

export function buildMapsPlaceUrl(): string {
  const { lat, lng } = getRestaurantCoords();
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export function getMapsEmbedUrl(): string {
  const { lat, lng } = getRestaurantCoords();
  return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
}

export function requestUserLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(
        new GeolocationError(
          "unsupported",
          "Geolocation is not supported by this browser.",
        ),
      );
      return;
    }

    const timeoutId = window.setTimeout(() => {
      reject(
        new GeolocationError(
          "timeout",
          "Location request timed out. Please try again.",
        ),
      );
    }, GEOLOCATION_TIMEOUT_MS);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        window.clearTimeout(timeoutId);
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        window.clearTimeout(timeoutId);

        if (error.code === error.PERMISSION_DENIED) {
          reject(
            new GeolocationError(
              "denied",
              "Location permission was denied.",
            ),
          );
          return;
        }

        if (error.code === error.TIMEOUT) {
          reject(
            new GeolocationError(
              "timeout",
              "Location request timed out. Please try again.",
            ),
          );
          return;
        }

        reject(
          new GeolocationError(
            "unavailable",
            "Unable to retrieve your location.",
          ),
        );
      },
      {
        enableHighAccuracy: false,
        timeout: GEOLOCATION_TIMEOUT_MS,
        maximumAge: 0,
      },
    );
  });
}
