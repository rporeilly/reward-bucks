import './App.css';
import React, {useState, useEffect} from 'react'
import { Flex, Center, VStack, Heading, Spacer, Button } from '@chakra-ui/react'
import { collection, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from './firebase'


function App() {

  const [dollars, setDollars] = useState([])
  const dollarsCollection = collection(db, 'dollars')

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

  console.log(dollars)

  return (
    <div className="App">
      <Center>

      <VStack boxShadow="xl" mt="10" p="6" rounded="2xl" bg="white">
          {dollars.map((child) => {
            let dollarColor
            let dollarSize
            if (child.dollars == 0) {
              dollarColor = '#000'
              dollarSize = 'xl'
            }
            if (child.dollars > 0 && child.dollars < 10) {
              dollarColor = '#127800'
              dollarSize = 'xl'
            }
            if (child.dollars >= 10) {
              dollarColor = '#1fd100'
              dollarSize = '2xl'
            }
            if (child.dollars < 0) {
              dollarColor = '#bf0000'
              dollarSize = 'xl'
            }
            return (

              <VStack w="320px" p="20px 0" key={child.id}>
                <Heading as="h4" size='md' borderBottom="1px solid">{child.name}'s Target Bucks</Heading>
                <Spacer />
                <Heading color={dollarColor} as="h1" size={dollarSize}>${child.dollars}</Heading>
                <Flex justify="space-around" w="50%" pt="10px">
                  <Button size='lg' onClick={() => decreaseDollars(child.id, child.dollars)}>-</Button>
                  <Button size='lg' onClick={() => increaseDollars(child.id, child.dollars)}>+</Button>
                </Flex>
                <Spacer />
                <Button size='sm' onClick={() => resetDollars(child.id, child.dollars)}>Reset</Button>
              </VStack>
            )
          })}
        </VStack>
      </Center>
    </div>
  );
}

export default App;
