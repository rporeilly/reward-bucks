import './App.css';
import React, {useState, useEffect} from 'react'
import { Flex, Center, VStack, Heading, Spacer, Button } from '@chakra-ui/react'
import { collection, doc, updateDoc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from './firebase'


function App() {

  const [dollars, setDollars] = useState([])
  const dollarsCollection = collection(db, 'dollars')

  // useEffect(() => {
  //   const getDollars = async () => {
  //     const dollarData = await getDocs(dollarsCollection)
  //     setDollars(dollarData.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  //   }
  //   getDollars()
  // }, []);

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

  console.log(dollars)

  return (
    <div className="App">
      <Center mw="500px">

      <VStack>
          {dollars.map((child) => {
            return (
              <VStack key={child.id}>
                <Heading as="h4" size='lg'>{child.name}'s Target Bucks:</Heading>
                <Spacer />
                <Heading as="h1" size='2xl'>${child.dollars}</Heading>
                <Flex justify="space-around" w="60%">
                  <Button size='lg' onClick={() => decreaseDollars(child.id, child.dollars)}>-</Button>
                  <Button size='lg' onClick={() => increaseDollars(child.id, child.dollars)}>+</Button>
                </Flex>
              </VStack>
            )
          })}
        </VStack>
      </Center>
    </div>
  );
}

export default App;
