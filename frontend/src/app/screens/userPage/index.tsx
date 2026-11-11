import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  AccountCircle,
  Close,
  Email,
  Phone,
  PhotoCamera,
} from "@mui/icons-material";
import { api } from "../../../lib/api";
import { fuels, makes } from "../../../constants";
import { carPhoto, regions, regionName, type Car } from "../../../types";
import { useSession } from "../../context/SessionContext";
import { useLocale } from "../../context/LocaleContext";

type Profile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "BUYER" | "SELLER" | "ADMIN";
  status: string;
  avatarUrl?: string;
  createdAt?: string;
};
const statusKey: Record<string, string> = {
  PENDING: "statusPendingLabel",
  ACTIVE: "statusActiveLabel",
  PAUSED: "statusPausedLabel",
  BLOCKED: "statusBlockedLabel",
  REJECTED: "statusRejectedLabel",
  SOLD: "statusSoldLabel",
  ARCHIVED: "statusArchivedLabel",
};

function SellerListings() {
  const { t, language } = useLocale();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<Car | null>(null);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const previews = useMemo(
    () => newPhotos.map((file) => URL.createObjectURL(file)),
    [newPhotos],
  );
  useEffect(
    () => () => previews.forEach((url) => URL.revokeObjectURL(url)),
    [previews],
  );
  useEffect(() => {
    let active = true;
    api<Car[]>("/api/cars/mine")
      .then((result) => {
        if (active) setCars(result);
      })
      .catch((cause: unknown) => {
        if (active)
          setError(cause instanceof Error ? cause.message : t("carsLoadError"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [t]);
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;
    setBusy(true);
    setError("");
    setNotice("");
    const form = event.currentTarget;
    const values = new FormData(form);
    const body = new FormData();
    for (const field of [
      "title",
      "make",
      "model",
      "year",
      "price",
      "mileage",
      "transmission",
      "fuel",
      "region",
      "description",
    ])
      body.append(field, String(values.get(field) ?? ""));
    newPhotos.forEach((file) => body.append("images", file));
    try {
      const updated = await api<Car>(`/api/cars/${editing._id}`, {
        method: "PATCH",
        body,
      });
      setCars((items) =>
        items.map((item) => (item._id === updated._id ? updated : item)),
      );
      setEditing(null);
      setNewPhotos([]);
      setNotice(t("listingUpdated"));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t("listingError"));
    } finally {
      setBusy(false);
    }
  };
  const remove = async (car: Car) => {
    if (!window.confirm(t("confirmDeleteListing"))) return;
    try {
      await api(`/api/cars/${car._id}`, { method: "DELETE" });
      setCars((items) => items.filter((item) => item._id !== car._id));
      setNotice(t("listingDeleted"));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t("listingError"));
    }
  };
  return (
    <Box className="seller-listings">
      <Box className="seller-listings-heading">
        <Typography variant="overline">AVTO.UZ</Typography>
        <Typography variant="h2" fontSize={25}>
          {t("myListings")}
        </Typography>
      </Box>
      {notice && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {notice}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {loading && (
        <Box className="page-loading">
          <CircularProgress />
        </Box>
      )}
      {!loading && cars.length === 0 && (
        <Alert severity="info">{t("noListings")}</Alert>
      )}
      <Stack spacing={1.5} className="seller-listings-stack">
        {cars.map((car) => (
          <Card key={car._id} className="listing-row" variant="outlined">
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Stack
                className="listing-row-inner"
                direction={{ xs: "column", sm: "row" }}
                spacing={2.5}
                alignItems={{ sm: "center" }}
              >
                <Box
                  component="img"
                  className="listing-row-image"
                  src={carPhoto(car)}
                  alt={car.title}
                />
                <Box className="listing-row-summary" sx={{ flex: 1 }}>
                  <Typography variant="h3" fontSize={18}>
                    {car.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {car.make} {car.model} · {car.year}
                  </Typography>
                  <Typography
                    className="listing-row-price"
                    color="text.secondary"
                  >
                    {Number(car.price).toLocaleString()} {t("currency")}
                  </Typography>
                  <Chip
                    size="small"
                    className="listing-status"
                    label={t(statusKey[car.status ?? ""] ?? car.status ?? "")}
                  />
                </Box>
                <Stack
                  className="listing-row-actions"
                  direction="row"
                  spacing={1}
                >
                  {!["PAUSED", "BLOCKED", "SOLD", "ARCHIVED"].includes(
                    car.status ?? "",
                  ) && (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setEditing(car);
                        setNewPhotos([]);
                      }}
                    >
                      {t("editListing")}
                    </Button>
                  )}
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => void remove(car)}
                  >
                    {t("deleteListing")}
                  </Button>
                </Stack>
              </Stack>
              {editing?._id === car._id && (
                <Paper
                  className="listing-edit-form"
                  component="form"
                  onSubmit={(event) => void save(event)}
                  variant="outlined"
                  sx={{ mt: 3, p: { xs: 1.5, sm: 2.5 } }}
                >
                  <Stack spacing={2}>
                    <Typography variant="h3" fontSize={18}>
                      {t("editListing")}
                    </Typography>
                    <TextField
                      name="title"
                      label={t("listingTitle")}
                      defaultValue={car.title}
                      required
                    />
                    <Box className="form-grid-two">
                      <TextField
                        name="make"
                        label={t("make")}
                        select
                        defaultValue={car.make}
                        required
                      >
                        {makes.map((make) => (
                          <MenuItem key={make} value={make}>
                            {make}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        name="model"
                        label={t("model")}
                        defaultValue={car.model}
                        required
                      />
                    </Box>
                    <Box className="form-grid-two">
                      <TextField
                        name="year"
                        label={t("year")}
                        type="number"
                        defaultValue={car.year}
                        required
                      />
                      <TextField
                        name="price"
                        label={t("price")}
                        type="number"
                        defaultValue={car.price}
                        required
                      />
                    </Box>
                    <Box className="form-grid-two">
                      <TextField
                        name="mileage"
                        label={t("mileage")}
                        type="number"
                        defaultValue={car.mileage}
                        required
                      />
                      <TextField
                        name="region"
                        label={t("region")}
                        select
                        defaultValue={car.region}
                        required
                      >
                        {regions.map(([key]) => (
                          <MenuItem key={key} value={key}>
                            {regionName(key, language)}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                    <Box className="form-grid-two">
                      <TextField
                        name="transmission"
                        label={t("transmission")}
                        select
                        defaultValue={car.transmission}
                      >
                        {["MANUAL", "AUTOMATIC", "ROBOT", "CVT"].map((key) => (
                          <MenuItem key={key} value={key}>
                            {key}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        name="fuel"
                        label={t("fuelType")}
                        select
                        defaultValue={car.fuel}
                      >
                        {fuels.map(([key]) => (
                          <MenuItem key={key} value={key}>
                            {key}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                    <TextField
                      name="description"
                      label={t("description")}
                      defaultValue={car.description ?? ""}
                      multiline
                      minRows={3}
                    />
                    {!!car.images?.length && (
                      <Box className="existing-image-row">
                        {car.images.map((path) => (
                          <Box
                            component="img"
                            key={path}
                            src={`/public${path}`}
                            alt={car.title}
                          />
                        ))}
                        <Typography variant="caption">
                          {t("keepImages")}
                        </Typography>
                      </Box>
                    )}
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<PhotoCamera />}
                    >
                      {t("chooseImages")}
                      <input
                        type="file"
                        hidden
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(event) =>
                          setNewPhotos(
                            Array.from(event.target.files ?? []).slice(
                              0,
                              Math.max(0, 10 - (car.images?.length ?? 0)),
                            ),
                          )
                        }
                      />
                    </Button>
                    {!!previews.length && (
                      <Box className="image-preview-grid">
                        {previews.map((url, index) => (
                          <Box
                            component="figure"
                            className="image-preview"
                            key={url}
                          >
                            <img
                              src={url}
                              alt={`${t("selectedPhoto")} ${index + 1}`}
                            />
                            <IconButton
                              aria-label={t("removePhoto")}
                              onClick={() =>
                                setNewPhotos((files) =>
                                  files.filter((_, i) => i !== index),
                                )
                              }
                            >
                              <Close />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    )}
                    <Stack direction="row" spacing={1}>
                      <Button type="submit" variant="contained" disabled={busy}>
                        {busy ? t("sending") : t("saveChanges")}
                      </Button>
                      <Button
                        type="button"
                        color="inherit"
                        onClick={() => {
                          setEditing(null);
                          setNewPhotos([]);
                        }}
                      >
                        {t("cancel")}
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

export default function UserPage() {
  const { member, updateMember } = useSession();
  const { t } = useLocale();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState("");
  const [avatarNotice, setAvatarNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarBusy, setAvatarBusy] = useState(false);
  useEffect(
    () => () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    },
    [avatarPreview],
  );
  useEffect(() => {
    if (!member) {
      setLoading(false);
      return;
    }
    let active = true;
    api<Profile>("/api/members/me")
      .then((result) => {
        if (active) setProfile(result);
      })
      .catch((cause: unknown) => {
        if (active)
          setError(cause instanceof Error ? cause.message : t("profileLogin"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [member?.id, t]);
  const uploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarBusy(true);
    setError("");
    setAvatarNotice("");
    const body = new FormData();
    body.append("avatar", file);
    try {
      const next = await api<Profile>("/api/members/me/avatar", {
        method: "POST",
        body,
      });
      setProfile(next);
      updateMember({ avatarUrl: next.avatarUrl });
      setAvatarPreview("");
      setAvatarNotice(t("photoUpdated"));
    } catch (cause) {
      setAvatarPreview("");
      setError(cause instanceof Error ? cause.message : t("listingError"));
    } finally {
      setAvatarBusy(false);
      input.value = "";
    }
  };
  const typeLabel =
    profile?.type === "SELLER"
      ? t("seller")
      : profile?.type === "ADMIN"
        ? t("admin")
        : t("buyer");
  return (
    <Container
      maxWidth="lg"
      className="account-page page-frame"
      sx={{ py: { xs: 5, md: 8 } }}
    >
      <Box className="page-intro">
        <Typography variant="overline" color="secondary.main">
          {t("personal")}
        </Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: 38, md: 54 }, mb: 3 }}>
          {t("profile")}
        </Typography>
      </Box>
      {loading && (
        <Box className="page-loading">
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {avatarNotice && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {avatarNotice}
        </Alert>
      )}
      {profile && (
        <Card className="account-overview">
          <CardContent
            className="account-overview-content"
            sx={{ p: { xs: 2.5, md: 4 } }}
          >
            <Stack
              className="account-identity"
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ sm: "center" }}
            >
              <Avatar
                src={
                  avatarPreview ||
                  (profile.avatarUrl
                    ? `/public${profile.avatarUrl}`
                    : undefined)
                }
                sx={{
                  width: 76,
                  height: 76,
                  bgcolor: "primary.main",
                  fontSize: 26,
                }}
              >
                {profile.name.slice(0, 1).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h2" fontSize={25}>
                  {profile.name}
                </Typography>
                <Chip
                  size="small"
                  color={profile.type === "SELLER" ? "secondary" : "default"}
                  label={typeLabel}
                />
              </Box>
              <Button
                component="label"
                variant="outlined"
                startIcon={<PhotoCamera />}
                disabled={avatarBusy}
              >
                {avatarBusy ? t("uploadingPhoto") : t("changePhoto")}
                <input
                  type="file"
                  hidden
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => void uploadAvatar(event)}
                />
              </Button>
            </Stack>
            <Stack className="account-details" spacing={1.5}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Email color="action" />
                <Typography>{profile.email}</Typography>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Phone color="action" />
                <Typography>{profile.phone}</Typography>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <AccountCircle color="action" />
                <Typography>
                  {t("status")}:{" "}
                  {profile.status === "ACTIVE" ? t("active") : profile.status}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}
      {profile && (profile.type === "SELLER" || profile.type === "ADMIN") && (
        <SellerListings />
      )}
      {!member && !loading && (
        <Alert severity="info">{t("profileLogin")}</Alert>
      )}
    </Container>
  );
}
