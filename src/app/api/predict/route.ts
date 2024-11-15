import { NextResponse } from 'next/server';
import { PythonShell } from 'python-shell';
import path from 'path';


export async function POST(request: Request) {
    try {
        const inputData = await request.json();

        const options: any = {
            mode: "json",
            pythonPath: 'python',
            scriptPath: path.join(process.cwd(), 'src', 'python'),
            args: [JSON.stringify(inputData)]
        };

        try {
            const results = await PythonShell.run('predict.py', options);
            
            if (results && results.length > 0) {
                const lastResult = results[results.length - 1];
                console.log(lastResult)
                if (!lastResult.error) return NextResponse.json(lastResult);
                throw new Error("Invalid Format")
            }
            
            throw new Error('No results from Python script');

          } catch (err: any) {
            throw err;
          }


    } catch (error) {
        console.error('Prediction error:', error);
        return NextResponse.json(
            { error: 'Failed to make prediction' },
            { status: 500 }
        );
    }
}