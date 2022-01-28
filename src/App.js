import './App.css';
import React, {useState, useEffect} from 'react'
import { Flex, Center, VStack, Heading, Spacer, Button, Box } from '@chakra-ui/react'
import { collection, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from './firebase'
import { getAuth, signInWithPopup, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import Confetti from 'react-confetti'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import { TailSpin } from  'react-loader-spinner'

function App() {

  const [dollars, setDollars] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const dollarsCollection = collection(db, 'dollars')

  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const onSignIn = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
    }).catch((error) => {
      // // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // // The email of the user's account used.
      // const email = error.email;
      // // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
    });
  }
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  });

  useEffect(() => {
    const unsub = onSnapshot(dollarsCollection, (snapshot) => {
      setDollars(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
      setIsLoaded(true)
    })
    return unsub
  }, []);

  const increaseDollars = async (id, dollars) => {
    const childDoc = doc(db, 'dollars', id)
    const newField = {dollars: dollars + 1}
    await updateDoc(childDoc, newField)
  }

  const decreaseDollars = async (id, dollars) => {
    const childDoc = doc(db, 'dollars', id)
    const newField = {dollars: dollars - 1}
    await updateDoc(childDoc, newField)
  }

  const resetDollars = async (id, dollars) => {
    const childDoc = doc(db, 'dollars', id)
    const newField = {dollars: 0}
    await updateDoc(childDoc, newField)
  }

  // console.log(dollars)
  // console.log(isLoggedIn)

  return (
    <div className="App">
      <Heading align="center" mt="20px" size="2xl" fontWeight="normal" mb="-25px" as="h1">Target Bucks<sup>™</sup></Heading>
      <Center>
      {isLoaded ?
      <VStack boxShadow="lg" mt="10" p="6" rounded="2xl" bg="white">
          {dollars.map((child) => {
            let dollarColor
            let dollarSize
            let confetti = false
            if (child.dollars === 0) {
              dollarColor = '#000'
              dollarSize = '4xl'
            }
            if (child.dollars > 0 && child.dollars < 10) {
              dollarColor = '#127800'
              dollarSize = '4xl'
            }
            if (child.dollars >= 10) {
              dollarColor = '#1fd100'
              dollarSize = '4xl'
              confetti = true
            }
            if (child.dollars < 0) {
              dollarColor = '#bf0000'
              dollarSize = '4xl'
            }
            return (
              <VStack w="300px" p="10px 0" key={child.id}>
                 {confetti && <Confetti
                  recycle={false}
                  numberOfPieces={700}
                  tweenDuration={10000}
                />}
                <Heading as="h4" size='md'>{child.name}:</Heading>
                <Spacer />
                <Heading color={dollarColor} as="h2" pb="5px" size={dollarSize}>${child.dollars}.00</Heading>
                {isLoggedIn &&
                <Flex justify="space-around" w="50%" pt="10px">
                  <Button size='md' colorScheme='red' variant="outline" onClick={() => decreaseDollars(child.id, child.dollars)}>-</Button>
                  <Button size='md' colorScheme='green' variant="outline" onClick={() => increaseDollars(child.id, child.dollars)}>+</Button>
                </Flex>}

                {isLoggedIn && <Spacer />}
                {isLoggedIn && <Button variant="outline"  size='sm' onClick={() => resetDollars(child.id, child.dollars)}>Reset</Button>}
              </VStack>
            )
          })}


        </VStack> :
        <VStack minW="300" minH="350px" boxShadow="lg" mt="10" pt="30px" rounded="2xl" bg="white">
          <Box mt="20%">
            <TailSpin
              height="100"
              width="100"
              color='#127800'
              style={{margin: '20px'}}
              ariaLabel='loading'
            />
          </Box>
        </VStack>
      }
      </Center>
      <Center m="30px 0">
        {!isLoggedIn && <Button colorScheme='blue' onClick={onSignIn}>Log In</Button> }
      </Center>
    </div>
  );
}

export default App;
