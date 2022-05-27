import { Avatar, Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabaseClient';

interface IEditForm {
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string;
  password?: string;
}

const Profile = () => {
  const user = supabase.auth.user();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IEditForm>({
    defaultValues: {
      email: user?.email,
      first_name: user?.user_metadata?.first_name,
      last_name: user?.user_metadata?.last_name,
      profile_image: user?.user_metadata?.profile_image,
    },
  });

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const imageKey = user?.user_metadata?.profile_image?.split(
    'fanq-user-profiles/'
  )[1];

  const updateImage = async (profile_image: any) => {
    const file = profile_image[0];
    const fileExt = file.name.split('.').pop();
    const filename = `${Date.now()}.${fileExt}`;

    let { error: deleteError } = await supabase.storage
      .from('fanq-user-profiles')
      .remove([imageKey]);

    if (deleteError) {
      throw deleteError;
    }

    let { data: newImage, error: uploadError } = await supabase.storage
      .from('fanq-user-profiles')
      .upload(filename, file);

    if (uploadError) {
      throw uploadError;
    }
    return newImage?.Key;
  };

  const editUser = async (data: any) => {
    const { profile_image, ...credentials } = data;

    try {
      const payload: any = {
        email: credentials?.email,
        data: {
          first_name: credentials?.first_name,
          profile_image:
            typeof profile_image === 'object'
              ? await updateImage(profile_image)
              : user?.user_metadata?.profile_image,
          last_name: credentials?.last_name,
        },
      };

      await supabase.auth.update(payload);
      setIsEditMode(false);
    } catch (error) {
      console.error('UPDATE USER ERROR:', error);
    }
  };

  return (
    <div>
      <div>
        <button
          onClick={() => {
            supabase.auth.signOut();
            router.push('/');
          }}
        >
          Sign Out
        </button>
        {isEditMode ? (
          <Flex justify={'center'}>
            <form onSubmit={handleSubmit(editUser)}>
              <Flex
                flexDirection={'column'}
                gap="4"
                marginTop={10}
                maxWidth={400}
              >
                <Flex justify={'center'}>
                  <Avatar
                    marginRight={4}
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL}/${user?.user_metadata.profile_image}`}
                  />
                  <Input {...register('profile_image')} type="file" />
                </Flex>
                {/* register your input into the hook by invoking the "register" function */}
                <Input
                  placeholder="email"
                  {...register('email', { required: true })}
                />
                <Input placeholder="first name" {...register('first_name')} />
                <Input placeholder="last name" {...register('last_name')} />
                {/* include validation with required or other standard HTML validation rules */}
                <Input
                  type={'password'}
                  placeholder="password"
                  {...register('password')}
                />

                {errors && <span>Please fill in properly.</span>}
                <Button type="submit" isLoading={loading} colorScheme="teal">
                  Edit
                </Button>
                <Button
                  onClick={() => setIsEditMode(false)}
                  isLoading={loading}
                  colorScheme="teal"
                >
                  Cancel
                </Button>
              </Flex>
            </form>
          </Flex>
        ) : (
          <Flex justifyContent={'center'} width="100%">
            <Box
              display={'flex'}
              flexDirection={'column'}
              alignItems={'center'}
              gap={5}
            >
              <Avatar
                src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL}/${user?.user_metadata.profile_image}`}
              />
              <Flex>
                <span>Email: </span> <Text marginLeft={2}>{user?.email}</Text>
              </Flex>
              <Flex>
                <span>Username: </span>{' '}
                <Text marginLeft={2}>{user?.user_metadata?.first_name}</Text>{' '}
                <Text marginLeft={1}>{user?.user_metadata?.last_name}</Text>
              </Flex>
            </Box>
            <Button onClick={() => setIsEditMode(true)}>Edit</Button>
          </Flex>
        )}
      </div>
    </div>
  );
};

export default Profile;
