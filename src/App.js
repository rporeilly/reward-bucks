import './App.css';
import React, {useState, useEffect} from 'react'
import { Flex, Center, VStack, Heading, Spacer, Button } from '@chakra-ui/react'
import { collection, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from './firebase'
import { getAuth, signInWithPopup, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import Confetti from 'react-confetti'

function App() {

  const [dollars, setDollars] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
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
      <Center>

      <VStack boxShadow="lg" mt="10" p="6" rounded="2xl" bg="white">
          {dollars.map((child) => {
            let dollarColor
            let dollarSize
            let confetti = false
            if (child.dollars === 0) {
              dollarColor = '#000'
              dollarSize = '2xl'
            }
            if (child.dollars > 0 && child.dollars < 10) {
              dollarColor = '#127800'
              dollarSize = '2xl'
            }
            if (child.dollars >= 10) {
              dollarColor = '#1fd100'
              dollarSize = '3xl'
              confetti = true
            }
            if (child.dollars < 0) {
              dollarColor = '#bf0000'
              dollarSize = '2xl'
            }
            return (
              <VStack w="300px" p="20px 0" key={child.id}>
                <Confetti
                  recycle={false}
                  run={confetti}
                  numberOfPieces={700}
                  tweenDuration={10000}
                  initialVelocityY={10, 20}
                />
                <Heading as="h4" size='md' fontWeight="normal" borderBottom="1px solid">{child.name}'s Target Bucks</Heading>
                <Spacer />
                <Heading color={dollarColor} as="h1" size={dollarSize}>${child.dollars}</Heading>
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
        {!isLoggedIn && <Button onClick={onSignIn}>Log In</Button> }
        </VStack>
      </Center>
    </div>
  );
}

export default App;
