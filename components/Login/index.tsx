"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { type FC, type JSX, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Link from "next/link";
import { LoginFormValues, loginSchema } from "./type";
import { useLoginHook } from "./hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

export const LoginComponent: FC = (): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false);
  const { loginAsync, loading, error: loginError } = useLoginHook();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await loginAsync(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 0, sm: 3, md: 0 },
        backgroundColor: "#EDEDED",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          width: { xs: "100%", sm: "85%", md: "100%" },
          maxWidth: { xs: "100%", sm: "480px", md: "580px" },
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            mb: { sm: 4, xs: 3 },
            mx: { sm: "auto", xs: 0 },
          }}
        >
          <Image
            src={"/assets/images/logo.webp"}
            alt={"Logo"}
            width={120}
            height={50}
            loading="eager"
          />
        </Box>
        <Paper
          sx={{
            p: { xs: 0, sm: "40px" },
            borderRadius: { sm: 3, xs: 0 },
            backgroundColor: { sm: "#fff", xs: "transparent" },
          }}
        >
          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: { xs: "18px", sm: "22px" },
              fontWeight: "bold",
              mb: 3,
              textTransform: "uppercase",
            }}
          >
            {"Login"}
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {/* backend error */}
            {loginError && (
              <Box
                sx={{
                  background: "#BF1D391A",
                  borderLeft: "2px solid #BF1D39",
                  p: "6px",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#BF1D39",
                  lineHeight: "120%",
                  fontFamily: "Noto Sans JP, sans-serif",
                }}
              >
                {loginError}
              </Box>
            )}

            <Box>
              <Typography
                component="label"
                htmlFor="email"
                sx={{
                  display: "block",
                  mb: "6px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#333",
                }}
              >
                Email
              </Typography>

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <OutlinedInput
                    {...field}
                    fullWidth
                    id="email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    placeholder="yamada@example.com"
                    size="medium"
                    error={!!errors.email}
                    sx={{
                      backgroundColor: {
                        sm: "#fff",
                        xs: "#EDEDED",
                        height: "40px",
                      },
                    }}
                  />
                )}
              />

              {/* Email Validation Error */}

              {errors.email?.message && (
                <Typography
                  sx={{
                    mt: "5px",
                    fontSize: "12px",
                    color: "error.main",
                  }}
                >
                  {errors.email.message}
                </Typography>
              )}
            </Box>

            {/* PASSWORD */}

            <Box>
              <Typography
                component="label"
                htmlFor="password"
                sx={{
                  display: "block",
                  mb: "6px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#333",
                }}
              >
                Password
              </Typography>

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <OutlinedInput
                    {...field}
                    fullWidth
                    id="password"
                    autoComplete="current-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="**************"
                    error={!!errors.password}
                    size="medium"
                    sx={{
                      backgroundColor: {
                        sm: "#fff",
                        xs: "#EDEDED",
                        height: "40px",
                      },

                      "& .MuiOutlinedInput-input": {
                        letterSpacing: "inherit",
                        minHeight: "21px",
                      },
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          type="button"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          onClick={() => setShowPassword((show) => !show)}
                          edge="end"
                        >
                          {showPassword ? (
                            <AiOutlineEye />
                          ) : (
                            <AiOutlineEyeInvisible />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />

              {/* Password Validation Error */}

              {errors.password?.message && (
                <Typography
                  sx={{
                    mt: "5px",
                    fontSize: "12px",
                    color: "error.main",
                  }}
                >
                  {errors.password.message}
                </Typography>
              )}
            </Box>

            <Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: { xs: 1, sm: 1 },
                  mb: { xs: "14px", sm: 2 },
                  py: { xs: 1, sm: 1.5 },
                  height: "45px",
                }}
                disabled={isSubmitting || loading}
              >
                {"Login"}
              </Button>
              <Box sx={{ textAlign: "center" }}>
                <Link
                  href={"#"}
                  style={{
                    textDecoration: "underline",
                    fontWeight: 600,
                    fontFamily: "Noto Sans JP, sans-serif",
                    color: "#06428A",
                  }}
                >
                  {"Forgot password"}
                </Link>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
