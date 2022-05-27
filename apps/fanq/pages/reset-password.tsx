import { Button, Flex, Input, useToast, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const router = useRouter();

  const session = supabase.auth.session();

  const [loading, setLoading] = useState<boolean>(false);

  const toast = useToast();

  const passwordReset = async (data: any) => {
    setLoading(true);
    const { new_password, confirm_password } = data;
    if (new_password !== confirm_password) {
      setError('confirm_password', {
        type: 'custom',
        message: 'Passwords doesnot match.',
      });
      setLoading(false);
      return;
    }
    const { data: resetData, error } = await supabase.auth.api.updateUser(
      session?.access_token as string,
      {
        password: data?.new_password,
      }
    );
    if (resetData) {
      toast({
        title: 'Password Resett',
        description: 'Password reset successful',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    }
    if (error) {
      toast({
        title: 'Password Resett',
        description: `Couldn't reset password`,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      throw new Error("Couldn't reset password");
    }
    setLoading(false);
    router.push('/profile');
  };

  return (
    <Flex justify={'center'}>
      <form onSubmit={handleSubmit(passwordReset)}>
        <Flex flexDirection={'column'} gap="4" marginTop={10} maxWidth={400}>
          <Input
            placeholder="new_password"
            {...register('new_password', { required: true })}
          />
          <Input
            placeholder="confirm_password"
            {...register('confirm_password')}
          />
          <Text color="red">{errors?.confirm_password?.message}</Text>
          <Button isLoading={loading} type="submit" colorScheme="teal">
            Reset Password
          </Button>
        </Flex>
      </form>
    </Flex>
  );
};

export default ResetPassword;
