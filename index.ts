import { ChatBot } from './chatbot';
import * as readline from 'readline/promises'; 
import { stdin } from 'node:process';
import { config } from 'dotenv'
import { readFile } from 'node:fs/promises'
import minimist from 'minimist'
import * as path from 'node:path'
import { createWriteStream } from "fs";
import chalk from 'chalk'
import { padStart } from 'lodash'

const argv = minimist(process.argv.slice(2))

const prompt = readline.createInterface({
    prompt: "> ",
    input: stdin,
    output: createWriteStream('/dev/null'),
})

config()

let shouldQuit = false

async function main() {

    const messages = argv.history 
        ? (await readFile(path.resolve(argv.history), 'utf-8').then(JSON.parse))
        : []

    if(argv.break) {
        readFile(path.resolve(argv.break), 'utf-8').then((content) => {
           messages.unshift({ role: "system", content: String(content) })
        })
    }
    
    if (argv.name) {
      messages.unshift({ role: "user", content: `Hello, my name is ${argv.name}.` }) 
    }

    const historyPath = path.resolve(process.cwd(), 'logs', argv.session || `history-${Date.now()}.json`)

    const chatbot = new ChatBot({ 
        messages,
        historyPath
    });

    while (!shouldQuit) {
        console.log(chalk.magentaBright.underline('You:'))
        const input = await prompt.question("")
        const response = await chatbot.send(input)
        
        const output = formatOutput(response)

        console.log("\n")
        console.log(chalk.cyanBright.underline('Bot:'))
        console.log("\n")
        console.log(output)
        console.log("\n")
    }
}

// Take the given string and format it into 60 character wide columns,
// perserving existing new lines.  Each row should have 10 characters of padding on each side.
function formatOutput(output: string) {
    const lines = output.trim().split("\n")
    const formattedLines = lines.map((line) => {
        const words = line.split(" ")
        let currentLine = ""
        let currentLineLength = 0
        const formattedWords = words.map((word) => {
            const wordLength = word.length
            if(currentLineLength + wordLength > 60) {
                const line = currentLine
                currentLine = word
                currentLineLength = wordLength
                return line
            } else {
                currentLine += ` ${word}`
                currentLineLength += wordLength
                return ""
            }
        }).filter(Boolean)
        return [...formattedWords, currentLine]
    })
    
    return formattedLines.flat().map((line) => padStart(line, 10)).join("\n")
}

main()