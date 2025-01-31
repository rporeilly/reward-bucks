import './App.css';
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Flex, Center, VStack, Heading, Spacer, Button, Box } from '@chakra-ui/react';
import { collection, doc, updateDoc, onSnapshot, CollectionReference, DocumentData } from 'firebase/firestore';
import { db } from './firebase';
import { getAuth, signInWithPopup, onAuthStateChanged, GoogleAuthProvider, User } from 'firebase/auth';
import Confetti from 'react-confetti';
import { TailSpin } from 'react-loader-spinner';
import { Dollar } from './types';

function App(): JSX.Element {
  const [dollars, setDollars] = useState<Dollar[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const dollarsCollection = useMemo(
    () => collection(db, 'dollars'),
    []
  );

  const search = useLocation().search;
  const id = new URLSearchParams(search).get('showLogin');

  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const onSignIn = (): void => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user.uid;
        console.log(user);
      })
      .catch((error) => {
        // Handle errors here if needed
      });
  };

  useEffect(() => {
    const handleAuthChange = (user: User | null): void => {
      setIsLoggedIn(!!user);
    };

    const unsubAuth = onAuthStateChanged(auth, handleAuthChange);
    return () => unsubAuth();
  }, [auth]);

  useEffect(() => {
    const unsub = onSnapshot(dollarsCollection, (snapshot) => {
      setDollars(
        snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Dollar[]
      );
      setIsLoaded(true);
    });
    return unsub;
  }, [dollarsCollection]);

  const increaseDollars = async (id: string, dollars: number): Promise<void> => {
    const childDoc = doc(db, 'dollars', id);
    await updateDoc(childDoc, {
      dollars: dollars + 1
    });
  };

  const decreaseDollars = async (id: string, dollars: number): Promise<void> => {
    const childDoc = doc(db, 'dollars', id);
    await updateDoc(childDoc, {
      dollars: dollars - 1
    });
  };

  const resetDollars = async (id: string): Promise<void> => {
    const childDoc = doc(db, 'dollars', id);
    await updateDoc(childDoc, {
      dollars: 0
    });
  };

  interface DollarStyles {
    color: string;
    size: string;
    confetti: boolean;
  }

  const getDollarStyles = (dollars: number): DollarStyles => {
    let dollarColor = '#000';
    let dollarSize = '4xl';
    let confetti = false;

    if (dollars > 0 && dollars < 10) {
      dollarColor = '#127800';
    } else if (dollars >= 10) {
      dollarColor = '#1fd100';
      confetti = true;
    } else if (dollars < 0) {
      dollarColor = '#bf0000';
    }

    return { color: dollarColor, size: dollarSize, confetti };
  };

  return (
    <div className="App">
      <Heading
        as="h1" color="white" textAlign="center" mt="20px" size="2xl" fontWeight="normal" mb="-25px"
      >
        Target Bucks<sup>™</sup>
      </Heading>
      <Center>
        {isLoaded ? (
          <VStack boxShadow="lg" mt="10" p="6" rounded="2xl" bg="white">
            {dollars.map((child) => {
              const { color: dollarColor, size: dollarSize, confetti } = getDollarStyles(child.dollars);
              return (
                <VStack w="300px" p="10px 0" key={child.id}>
                  {confetti && (
                    <Confetti
                      width={window.innerWidth}
                      height={window.innerHeight}
                      numberOfPieces={700}
                      recycle={false}
                      tweenDuration={10000}
                    />
                  )}
                  <Heading as="h4" size="md">
                    {child.name}:
                  </Heading>
                  <Spacer />
                  <Heading color={dollarColor} as="h2" pb="5px" size={dollarSize}>
                    ${child.dollars}.00
                  </Heading>
                  {isLoggedIn && (
                    <Flex justify="space-around" w="50%" pt="10px">
                      <Button
                        size="md"
                        colorScheme="red"
                        variant="outline"
                        onClick={() => decreaseDollars(child.id, child.dollars)}
                      >
                        -
                      </Button>
                      <Button
                        size="md"
                        colorScheme="green"
                        variant="outline"
                        onClick={() => increaseDollars(child.id, child.dollars)}
                      >
                        +
                      </Button>
                    </Flex>
                  )}
                  {isLoggedIn && <Spacer />}
                  {isLoggedIn && (
                    <Button variant="outline" size="sm" onClick={() => resetDollars(child.id)}>
                      Reset
                    </Button>
                  )}
                </VStack>
              );
            })}
          </VStack>
        ) : (
          <VStack minW="300" minH="350px" boxShadow="lg" mt="10" pt="30px" rounded="2xl" bg="white">
            <Box mt="20%">
              <TailSpin
                height={100}
                width={100}
                color="#127800"
                wrapperStyle={{ margin: '20px' }}
                ariaLabel="loading"
              />
            </Box>
          </VStack>
        )}
      </Center>
      <Center m="30px 0">
        {!isLoggedIn && id === process.env.REACT_APP_paramKey && (
          <Button colorScheme="gray" onClick={onSignIn}>
            Log In
          </Button>
        )}
      </Center>
    </div>
  );
}

export default App;
