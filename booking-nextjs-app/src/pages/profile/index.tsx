import PrimaryButton from "@/components/PrimaryButton";
import { Layout } from "../layout";
import defaultAvatar from "@/images/default-avatar.svg";
import avatarUpload from "@/images/avatar-upload.svg";
import Image from "next/image";
import InputField from "@/components/InputField";
import { withAuthPage } from "@/utils/withAuthPage";
import { Session } from "next-auth";
import {
  PROFILE_QUERY_KEY,
  useProfile,
  useUpdateProfile,
} from "@/hooks/useProfile";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileSchema, profileSchema } from "@/schemas/profile";
import React, { useRef } from "react";
import { useCountries } from "@/hooks/useCountries";
import SelectInput from "@/components/SelectInput";
import { queryClient } from "@/utils/queryClient";
import LightButton from "@/components/LightButton";

interface ProfilePageProps {
  session: Session;
}

export default function ProfilePage({ session }: ProfilePageProps) {
  const { data: resultUser } = useProfile();
  const user = resultUser?.user;
  const { mutate, isPending, isError, error } = useUpdateProfile();
  const { data: resultCountry } = useCountries();
  const countryList = resultCountry?.countries || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
  });

  React.useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  const onSubmit = (data: ProfileSchema) => mutate(data);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch("/api/profile/upload-avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      if (data.url) {
        queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  const bookingHistoryButton = (
    <PrimaryButton className="w-full md:w-[262px] h-[2.5rem]">
      История бронирований
    </PrimaryButton>
  );

  return (
    <Layout>
      <div className="flex flex-col justify-self-center w-full md:w-auto gap-3">
        <div className="flex items-center gap-2 md:mb-6">
          <h1 className="text-xl md:text-3xl font-bold">Профиль</h1>
        </div>
        <div className="flex flex-col gap-6 bg-white px-6 py-[2.5rem] shadow-[0_4px_8px_rgba(0,0,0,0.15)] rounded-lg font-sans">
          <div className="flex justify-center md:justify-between">
            <div className="relative">
              <button
                className="relative cursor-pointer"
                onClick={handleAvatarClick}
              >
                <div className="w-[92px] h-[92px] rounded-full overflow-hidden">
                  <Image
                    src={user?.imageUrl || defaultAvatar}
                    width={92}
                    height={92}
                    className="object-cover w-full h-full"
                    alt="Аватар пользователя"
                  />
                </div>
                <Image
                  src={avatarUpload}
                  width={40}
                  height={40}
                  className="absolute bottom-0 right-[-20px] w-[40px] h-[40px] rounded-full"
                  alt="Загрузить аватар"
                />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="hidden md:block">{bookingHistoryButton}</div>
          </div>
          <form
            className="flex flex-col gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col md:flex-row gap-2">
              <InputField
                label="Имя"
                width="w-full md:w-[262px]"
                error={errors.firstName}
                {...register("firstName")}
              />
              <InputField
                label="Фамилия"
                width="w-full md:w-[262px]"
                error={errors.lastName}
                {...register("lastName")}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <InputField
                label="Email"
                width="w-full md:w-[262px]"
                error={errors.email}
                {...register("email")}
              />
              <Controller
                name="defaultCountry"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...register("defaultCountry")}
                    title="Страна"
                    className="w-full md:w-[262px] px-[14px] py-[8px]"
                    data={countryList}
                    typeCombobox={true}
                    placeholder="Выберите страну"
                    value={field.value ?? null}
                    onChange={field.onChange}
                    required
                  />
                )}
              />
              {errors.defaultCountry && (
                <p className="text-sm text-red-500">
                  {errors.defaultCountry.message || "Произошла ошибка"}
                </p>
              )}
            </div>
            {isError && (
              <p className="text-red-500 text-sm">
                {(error as Error)?.message || "Произошла ошибка"}
              </p>
            )}
            <div className="flex justify-start mt-2">
              <LightButton
                type="submit"
                className="mt-2 w-full md:w-[262px]"
                disabled={isPending}
              >
                {isPending ? "Сохраняем..." : "Сохранить изменения"}
              </LightButton>
            </div>
          </form>
        </div>
        <div className="font-sans mt-4 block md:hidden">
          {bookingHistoryButton}
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = withAuthPage();
